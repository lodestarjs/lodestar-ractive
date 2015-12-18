set -e

# Get the version from the package JSON
VERSION=$(cat package.json | grep 'version' | sed 's/"version": "\(.*\)",/\1/' | sed 's/[[:space:]]//g')
NAME=$(cat package.json | grep 'name' | sed 's/"name": "\(.*\)",/\1/' | sed 's/[[:space:]]//g')
BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
UPSTREAM=$(git rev-parse --abbrev-ref master@{u})

read -p "Releasing $VERSION for $NAME - are you sure? (y/n)" -n 1 -r
echo # Putting in a  new line...

if [ $REPLY == "y" ]; then

  echo "> Beginning release of $NAME version $VERSION"

  if [ $BRANCH != "master" ]; then
    echo "> Changing branch"
    git checkout master
  fi

  # Get latest from master
  git fetch
  git merge ${UPSTREAM}

  echo "> Linting code"
  npm run lint

  echo "> Building release"

  # Clean dist just incase something is left over...
  rm -rf dist
  npm run build

  echo "> Publishing to npm"
  npm publish

  echo "> Pushing release to Github"

  git add dist
  git commit -m "Release - $VERSION"
  git push

  git tag -a v${VERSION} -m "Release - $VERSION"
  git push origin v${VERSION}

  echo "> Finished release and exiting..."

else
  echo "> Exiting release process..."
fi