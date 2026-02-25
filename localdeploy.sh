git submodule update --init --recursive
gem install bundler --user-install
bundle config set --local path 'vendor/bundle'
bundle install
bundle exec jekyll serve --config _config.yml --livereload
