pipeline {
    agent any

    environment {
        PROD_HOST  = credentials('DO_HOST')
        PROD_USER  = credentials('DO_USER')
        DEPLOY_DIR = '/www/wwwroot/CITSNVN/jenkins/angular'
        BACKUP_DIR = '/www/wwwroot/CITSNVN/jenkins/angular_backup'
        BUILD_DIR  = 'dist/my-project'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/saddamhdev/dataCollectionAngular.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Verify Files') {
            steps {
                bat 'dir src\\app\\environments'
            }
        }

        stage('Build Angular Project') {
            steps {
                // Skip prerender to avoid build failure
                bat 'ng build --configuration=production'
            }
        }

        stage('Backup Current Deployment') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'DO_SSH_KEY', keyFileVariable: 'SSH_KEY')]) {
                    script {
                        def bashCmd = '''#!/bin/bash
                            ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" ${PROD_USER}@${PROD_HOST} <<EOF
                                echo "📦 Backing up current deployment..."
                                if [ -d "${DEPLOY_DIR}" ]; then
                                    rm -rf ${BACKUP_DIR}
                                    cp -r ${DEPLOY_DIR} ${BACKUP_DIR}
                                    echo "✅ Backup created."
                                else
                                    echo "⚠️ No current deployment found, skipping backup."
                                fi
EOF
                        '''
                        writeFile file: 'backup.sh', text: bashCmd
                        bat '"C:\\Program Files\\Git\\bin\\bash.exe" backup.sh'
                    }
                }
            }
        }

        stage('Deploy to DigitalOcean') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'DO_SSH_KEY', keyFileVariable: 'SSH_KEY')]) {
                    script {
                        def deployCmd = """
                            "C:\\Program Files\\Git\\bin\\bash.exe" -c \\
                            "scp -o StrictHostKeyChecking=no -i \\"$SSH_KEY\\" -r ${BUILD_DIR}/* ${PROD_USER}@${PROD_HOST}:${DEPLOY_DIR}"
                        """
                        bat deployCmd
                    }
                }
            }
        }

        stage('Reload NGINX & Restart Backend') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'DO_SSH_KEY', keyFileVariable: 'SSH_KEY')]) {
                    script {
                        def bashCmd = '''#!/bin/bash
                            ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" ${PROD_USER}@${PROD_HOST} <<'EOF'
                                echo "🔁 Testing NGINX config..."
                                NG_BIN="/www/server/nginx/sbin/nginx"
                                NG_CONF="/www/server/nginx/conf/nginx.conf"
                                NG_PID="/www/server/nginx/logs/nginx.pid"

                                sudo "$NG_BIN" -t -c "$NG_CONF"

                                # Ensure PID file exists
                                if [ ! -s "$NG_PID" ]; then
                                  MASTER_PID=$(pgrep -o nginx || true)
                                  if [ -n "$MASTER_PID" ]; then
                                    echo "$MASTER_PID" | sudo tee "$NG_PID"
                                  fi
                                fi

                                echo "🔄 Reloading NGINX..."
                                sudo "$NG_BIN" -s reload
                                echo "✅ NGINX reloaded successfully."
EOF
                        '''
                        writeFile file: 'remote.sh', text: bashCmd
                        bat '"C:\\Program Files\\Git\\bin\\bash.exe" remote.sh'
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Angular build and deploy complete!'
        }

        failure {
            script {
                echo '❌ Build or deployment failed. Starting rollback...'

                withCredentials([sshUserPrivateKey(credentialsId: 'DO_SSH_KEY', keyFileVariable: 'SSH_KEY')]) {
                    def rollbackCmd = '''#!/bin/bash
                        ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" ${PROD_USER}@${PROD_HOST} <<'EOF'
                            echo "⏪ Rolling back to previous deployment..."
                            if [ -d "${BACKUP_DIR}" ]; then
                                rm -rf ${DEPLOY_DIR}
                                cp -r ${BACKUP_DIR} ${DEPLOY_DIR}
                                echo "✅ Rollback restored."
                            else
                                echo "⚠️ No backup available to rollback."
                            fi

                            NG_BIN="/www/server/nginx/sbin/nginx"
                            NG_CONF="/www/server/nginx/conf/nginx.conf"
                            NG_PID="/www/server/nginx/logs/nginx.pid"

                            sudo "$NG_BIN" -t -c "$NG_CONF"

                            if [ ! -s "$NG_PID" ]; then
                              MASTER_PID=$(pgrep -o nginx || true)
                              if [ -n "$MASTER_PID" ]; then
                                echo "$MASTER_PID" | sudo tee "$NG_PID"
                              fi
                            fi

                            sudo "$NG_BIN" -s reload
                            echo "✅ Rollback completed & NGINX reloaded."
EOF
                    '''
                    writeFile file: 'rollback.sh', text: rollbackCmd
                    bat '"C:\\Program Files\\Git\\bin\\bash.exe" rollback.sh'
                }

                // Disabled email step until SMTP is configured
                echo "📧 Email notification skipped (no SMTP configured)."
            }
        }
    }
}
