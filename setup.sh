sudo yum install -y python3 python3-pip
sudo ln -s /usr/bin/python3 /usr/bin/python
sudo ln -s /usr/bin/pip3 /usr/bin/pip
sudo pip install --upgrade pip
pip install -r LookFast/src/backend/requirements.txt --no-cache-dir
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu