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
                sh 'npm install'
            }
        }

        stage('Verify Files') {
            steps {
                sh 'ls -la src/app/environments'
            }
        }

        stage('Build Angular Project') {
            steps {
                sh 'ng build --configuration=production'
            }
        }

        stage('Backup Current Deployment') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'DO_SSH_KEY', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" ${PROD_USER}@${PROD_HOST} '
                            echo "📦 Backing up current deployment..."
                            if [ -d "${DEPLOY_DIR}" ]; then
                                rm -rf ${BACKUP_DIR}
                                cp -r ${DEPLOY_DIR} ${BACKUP_DIR}
                                echo "✅ Backup created."
                            else
                                echo "⚠️ No current deployment found, skipping backup."
                            fi
                        '
                    '''
                }
            }
        }

        stage('Deploy to DigitalOcean') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'DO_SSH_KEY', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                        scp -o StrictHostKeyChecking=no -i "$SSH_KEY" -r dist/my-project/* \
                        ${PROD_USER}@${PROD_HOST}:${DEPLOY_DIR}
                    '''
                }
            }
        }

        stage('Reload NGINX & Restart Backend') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'DO_SSH_KEY', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" ${PROD_USER}@${PROD_HOST} '
                            echo "🔁 Testing NGINX config..."
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

                            echo "🔄 Reloading NGINX..."
                            sudo "$NG_BIN" -s reload
                            echo "✅ NGINX reloaded successfully."
                        '
                    '''
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
            }

            withCredentials([sshUserPrivateKey(credentialsId: 'DO_SSH_KEY', keyFileVariable: 'SSH_KEY')]) {
                sh '''
                    ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" ${PROD_USER}@${PROD_HOST} '
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
                    '
                '''
            }

            echo "📧 Email notification skipped (no SMTP configured)."
        }
    }
}
