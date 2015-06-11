from flask.ext.script import Manager
from flask.ext.migrate import Migrate, MigrateCommand
import os

import panelka
manager = panelka.manager
# app.config.from_object(os.environ['APP_SETTINGS'])

migrate = Migrate(panelka.create_app, panelka.db)

manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()

