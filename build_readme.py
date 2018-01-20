#/usr/bin/env python3

import glob

base = "https://rawgit.com/JustusJ/userscripts/master/"
x = map(lambda x: base + x, glob.glob("*/**user.js"))

readme = open("README.md", "w")

readme.write("\n".join(list(x).sort()))

readme.close()
