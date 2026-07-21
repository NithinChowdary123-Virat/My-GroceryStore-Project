from rest_framework import serializers
from groceryapp.models import Product,Order,OrderDetails,UOM,Cart,CartItem,Category
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','password','email']
class UOMSerializer(serializers.ModelSerializer):
    class Meta:
        model = UOM
        fields = '__all__'
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    uom_name =  serializers.CharField(source="uom.uom_name", read_only=True)
    category_name = serializers.CharField(source="category.category_name", read_only=True)
    class Meta:
        model = Product
        fields = '__all__'

class OrderDetailsSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta:
        model = OrderDetails
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderDetailsSerializer(source='orderdetails_set', many=True, read_only=True)
    class Meta:
        model = Order
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = '__all__'

class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderDetailsSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)

        for item in items_data:
            OrderDetails.objects.create(order=order, **item)

        return order