#!/usr/bin/env bash
echo "-----------------"
echo "Installing Jekyll"
echo "-----------------"

echo "Adding ruby 2 ppa"
apt-add-repository ppa:brightbox/ruby-ng -y
apt-get update

echo "Installing ruby"
apt-get install ruby2.2 -y

echo "Installing ruby dev tools"
apt-get install ruby2.2-dev -y

echo "Installing Jekyll"
gem install jekyll bundler
