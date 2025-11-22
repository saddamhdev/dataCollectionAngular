pipeline {
    agent any

    environment {
        PROD_USER = "root"
        PROD_HOST = "159.89.172.251"

        DEPLOY_DIR = "/www/wwwroot/CITSNVN/jenkins/angular"
        BACKUP_DIR = "/www/wwwroot/CITSNVN/jenkins/angular_backup"
        BUILD_DIR  = "dist/my-project"
    }

    stages {

        stage('Verify Credentials') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'DO_SSH_PASSWORD',
                    usernameVariable: 'SSH_USER',
                    passwordVariable: 'SSH_PASS'
                )]) {
                    echo "🟢 Password credentials OK"
                }
            }
        }

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

        stage('Build Angular') {
            steps {
                sh 'ng build --configuration=production'
            }
        }

        stage('Backup Old Deployment') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'DO_SSH_PASSWORD',
                    usernameVariable: 'SSH_USER',
                    passwordVariable: 'SSH_PASS'
                )]) {

                    sh '''
                        echo "📦 Creating backup..."
                        sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no ${PROD_USER}@${PROD_HOST} "
                            if [ -d '${DEPLOY_DIR}' ]; then
                                rm -rf ${BACKUP_DIR};
                                cp -r ${DEPLOY_DIR} ${BACKUP_DIR};
                                echo '✅ Backup done';
                            else
                                echo '⚠️ No old deployment found';
                            fi
                        "
                    '''
                }
            }
        }

        stage('Deploy Angular Build') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'DO_SSH_PASSWORD',
                    usernameVariable: 'SSH_USER',
                    passwordVariable: 'SSH_PASS'
                )]) {

                    sh '''
                        echo "🚀 Uploading Angular build..."
                        sshpass -p "$SSH_PASS" scp -o StrictHostKeyChecking=no -r dist/my-project/* \
                        ${PROD_USER}@${PROD_HOST}:${DEPLOY_DIR}
                    '''
                }
            }
        }

        stage('Reload NGINX') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'DO_SSH_PASSWORD',
                    usernameVariable: 'SSH_USER',
                    passwordVariable: 'SSH_PASS'
                )]) {

                    sh '''
                        echo "🔁 Reloading NGINX..."
                        sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no ${PROD_USER}@${PROD_HOST} "
                            NG=/www/server/nginx/sbin/nginx;
                            CONF=/www/server/nginx/conf/nginx.conf;

                            sudo \$NG -t -c \$CONF && sudo \$NG -s reload;
                            echo '✅ NGINX reload complete';
                        "
                    '''
                }
            }
        }

    }

    post {
        success {
            echo "🎉 Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}
