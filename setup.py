from setuptools import setup

setup(name='airports',
      version='1.0',
      description='OpenShift App',
      author='mendrugory',
      author_email='mendrugory@gmail.com',
      url='http://airports-dollbox.rhcloud.com/',
	install_requires=['Flask', 'MarkupSafe', 'flask-mongoengine', 'mongoengine'],
     )
