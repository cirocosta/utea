set -e
rm -rf out || exit 0;
rm -rf lib || exit 0;

mkdir lib
mkdir out;

npm run build

cp -r lib/ out/
cp -r example/ out/

cd out

git init
git config user.name "Travis"
git config user.email "Travis@Space.Station"
git add .
git commit -m "Deploy to gh-pages"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1

