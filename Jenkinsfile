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
                git branch: 'main', url: 'https://github.com/saddamhdev/JenkinsAngularProject.git'
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
                                rm -rf ${BACKUP_DIR}
                                cp -r ${DEPLOY_DIR} ${BACKUP_DIR}
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
                            "C:\\Program Files\\Git\\bin\\bash.exe" -c \
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
                            ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" ${PROD_USER}@${PROD_HOST} <<EOF
                                echo "🔁 Testing NGINX config..."
                                nginx -t && systemctl reload nginx
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
                        ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" ${PROD_USER}@${PROD_HOST} <<EOF
                            echo "⏪ Rolling back to previous deployment..."
                            rm -rf ${DEPLOY_DIR}
                            cp -r ${BACKUP_DIR} ${DEPLOY_DIR}
                            nginx -t && systemctl reload nginx
EOF
                    '''
                    writeFile file: 'rollback.sh', text: rollbackCmd
                    bat '"C:\\Program Files\\Git\\bin\\bash.exe" rollback.sh'
                }

                mail to: '01957098631a@gmail.com',
                    subject: "❌ Jenkins Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """\
Hello,

The Jenkins build for job *${env.JOB_NAME}* (build #${env.BUILD_NUMBER}) has **failed**.

Rollback has been triggered. Please review the console output.

🔗 Link: ${env.BUILD_URL}

Regards,  
Jenkins
"""
            }
        }
    }
}
