class AppRouter:

    # Decide which database to read from
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'dbapp':
            return 'default'
        elif model._meta.app_label == 'groceryapp':
            return 'grocery_db'
        return None

    # Decide which database to write to
    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'dbapp':
            return 'default'
        elif model._meta.app_label == 'groceryapp':
            return 'grocery_db'
        return None

    # Control migrations
    def allow_migrate(self, db, app_label, model_name=None, **hints):

        if app_label == 'dbapp':
            return db == 'default'

        if app_label == 'groceryapp':
            return db == 'grocery_db'

        return None