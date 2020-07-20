from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Creates an initial superuser'

    def handle(self, *args, **options):
        if User.objects.count() == 0:
            username = 'admin'
            password = 'admin'
            email = 'michaelmuratov18@gmail.com'
            print('Creating account for %s (%s)' % (username, email))
            admin = User.objects.create_superuser(email=email, username=username, password=password)
            admin.is_active = True
            admin.is_admin = True
            admin.save()
        else:
            print('Admin accounts can only be initialized if no Accounts exist')