from django.db import models
from django.contrib.auth.models import User

class UOM(models.Model):
    uom_id = models.AutoField(primary_key=True)
    uom_name = models.CharField(max_length=45)
    class Meta:
        db_table = 'groceryapp_uom'

class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=100)

    class Meta:
        db_table = 'category'

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=50)
    uom = models.ForeignKey(UOM, on_delete=models.DO_NOTHING, db_column='uom_id')
    price_per_item = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(null=True)
    description = models.TextField(null=True)
    image = models.ImageField(upload_to='products/', null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    class Meta:
        db_table = 'groceryapp_product'

class Order(models.Model):
    STATUS_CHOICES = [
        ("placed", "Placed"),
        ("cancelled", "Cancelled"),
    ]
    order_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, null=True, default="placed")
    total = models.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        db_table = 'groceryapp_order'
 

class OrderDetails(models.Model):
    order_details_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING, db_column='order_id')
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING, db_column='product_id')
    quantity = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        db_table = 'groceryapp_order_details'


class Cart(models.Model):
    cart_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = 'cart'
    
class CartItem(models.Model):
    cart_item_id = models.AutoField(primary_key=True)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    class Meta:
        db_table = 'cart_items'
        unique_together = ["cart", "product"]


    
