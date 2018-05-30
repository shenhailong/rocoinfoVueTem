gulp sass
node build/build.js
cp -R ./dist ./wap
tar -zcvf ./wap.tar.gz wap
rm -rf ./wap
cp ./wap.tar.gz ../oil_mall/oil_mall_wap/src/main/resources/static/wap/html/
rm ./wap.tar.gz
cd ../oil_mall/oil_mall_wap/src/main/resources/static/wap/html/
git checkout dev
git pull
rm -rf ./wap
tar -zxvf ./wap.tar.gz
rm ./wap.tar.gz
open .
