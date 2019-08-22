css_files := $(wildcard *.css)
html_files := $(wildcard *.html)
js_files := $(wildcard *.js)
png_files := $(wildcard *.png)

chrome-django-panel.zip: manifest.json $(css_files) $(html_files) $(js_files) $(png_files)
	zip -FS $@ $+
