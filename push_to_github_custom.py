import os
import requests
import subprocess

# إعدادات المستخدم
GITHUB_USERNAME = 'odm-ur-gov-iq'
GITHUB_TOKEN = 'your-personal-access-token'  # <-- استبدله بتوكن GitHub الخاص بك
REPO_NAME = 'watchingfaile16347827255'
REPO_DESC = 'نظام تحقق أور - QR موقّع وتحقق رقمي باستخدام Flask'
PRIVATE = False  # المستودع عام

# إنشاء المستودع على GitHub
def create_repo():
    url = 'https://api.github.com/user/repos'
    headers = {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json'
    }
    data = {
        'name': REPO_NAME,
        'description': REPO_DESC,
        'private': PRIVATE
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 201:
        print(f'تم إنشاء المستودع: https://github.com/{GITHUB_USERNAME}/{REPO_NAME}')
        return True
    elif response.status_code == 422:
        print('المستودع موجود بالفعل.')
        return True
    else:
        print('فشل إنشاء المستودع:', response.text)
        return False

# دفع الملفات إلى GitHub
def push_to_github():
    repo_url = f'https://{GITHUB_USERNAME}:{GITHUB_TOKEN}@github.com/{GITHUB_USERNAME}/{REPO_NAME}.git'
    commands = [
        'git init',
        'git add .',
        'git commit -m "نشر أولي لمشروع نظام تحقق أور"',
        f'git remote add origin {repo_url}',
        'git branch -M main',
        'git push -u origin main --force'
    ]
    for cmd in commands:
        subprocess.run(cmd, shell=True)
    print('تم رفع المشروع بنجاح.')

if __name__ == '__main__':
    if create_repo():
        push_to_github()