from django.shortcuts import render
from rest_framework.views import APIView
from .serializer import ProductSerializer,UOMSerializer,OrderSerializer,OrderDetailsSerializer,OrderCreateSerializer, CartSerializer, CartItemSerializer,UserSerializer,CategorySerializer
from groceryapp.models import Product, Order,OrderDetails, UOM, Cart,CartItem,Category
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK,HTTP_201_CREATED,HTTP_400_BAD_REQUEST,HTTP_401_UNAUTHORIZED
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

class UOM_API(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    def get(self,request):
        uom_obj = UOM.objects.all()
        s_obj = UOMSerializer(uom_obj,many=True)
        return Response(s_obj.data)
    
class CategoryList(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class Products(APIView):
    def get_authenticators(self):
        if self.request.method == "POST":
            return [JWTAuthentication()]
        return []
    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdminUser()]
        return [AllowAny()]
    def get(self,request):
        category_id = request.GET.get('category')
        if category_id:
            pobj = Product.objects.filter(category_id=category_id)  
        else:
            pobj = Product.objects.all()
        s_obj = ProductSerializer(pobj,many=True)
        return Response(s_obj.data)
    def post(self,request):
        print("------ REQUEST USER INFO ------")
        print("Username:", request.user.username)
        print("Email:", request.user.email)
        print("User ID:", request.user.id)
        print("Is Staff:", request.user.is_staff)
        print("Is Superuser:", request.user.is_superuser)
        print("--------------------------------")
        s_obj = ProductSerializer(data=request.data)
        if s_obj.is_valid():
            s_obj.save()
            return Response(status=HTTP_201_CREATED)
        else:
            return Response(s_obj.errors, status=HTTP_400_BAD_REQUEST)
        
class Product_Modify(APIView):
    def get_authenticators(self):
        if self.request.method in ["PATCH","DELETE"]:
            return [JWTAuthentication()]
        return []

    def get_permissions(self):
        if self.request.method in ["PATCH","DELETE"]:
            return [IsAdminUser()]
        return [AllowAny()]
    
    def get(self,request,pk):
        pid = get_object_or_404(Product, product_id=pk) #pid = Product.objects.get(product_id = pk)
        s_obj = ProductSerializer(pid)
        return Response(s_obj.data)
    def patch(self,request,pk):
        print("Admin check:", request.user, request.user.is_staff)
        pid = get_object_or_404(Product, product_id=pk) #pid = Product.objects.get(product_id = pk)
        s_obj = ProductSerializer(pid,data = request.data,partial=True)
        if s_obj.is_valid() == True:
            s_obj.save()
            return Response(s_obj.data)
        else:
            return Response(s_obj.errors)
    def delete(self,request,pk):
        print("Admin check:", request.user, request.user.is_staff)
        pid = get_object_or_404(Product, product_id=pk) #pid = Product.objects.get(product_id = pk)
        pid.delete()
        return Response(status=HTTP_200_OK)
    
class SearchView(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    def get(self,request):
        search_pattern = request.query_params.get('search')
        if not search_pattern:
            return Response(
                {"message": "Please enter a product name"},
                status=HTTP_200_OK
            )
        prod = Product.objects.filter(product_name__icontains=search_pattern)
        if not prod.exists():
            return Response({"message": "No data found"}, status=HTTP_200_OK)
        s_obj = ProductSerializer(prod, many=True)
        return Response(s_obj.data,status=HTTP_200_OK)
    
class Cart_API(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        cart_data = CartItem.objects.filter(cart__user=request.user).select_related("product")
        serializer = CartItemSerializer(cart_data, many=True)
        return Response(serializer.data)
    
class AddToCart(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self,request,id):
        print("USER:", request.user)
        print("AUTH:", request.auth)
        product = get_object_or_404(Product, product_id=id)
        cart ,created = Cart.objects.get_or_create(user=request.user) # If user have cart it will use. if user dont have any cart it will create a new cart
        cart_item = CartItem.objects.filter(cart=cart,product=product).first()
        if cart_item:
            cart_item.quantity += 1
            cart_item.save()
        else:
            CartItem.objects.create(
                cart=cart,
                product=product,
                quantity=1
            )
        return Response({"message": "Product added to cart"},status=HTTP_200_OK)

class UpdateCart(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def patch(self,request,id):
        cart_item = get_object_or_404(
            CartItem,
            cart_item_id=id,
            cart__user=request.user
        )
        stock_quantity = cart_item.product.quantity
        

        action = request.data.get("action")

        if action == "increase":
            requested_quantity = cart_item.quantity + 1
        elif action == "decrease":
            requested_quantity = cart_item.quantity - 1
        else:
            return Response({"error": "Invalid action"},status=HTTP_400_BAD_REQUEST)
        
        if requested_quantity <= stock_quantity:
            cart_item.quantity = requested_quantity
            cart_item.save()
        if requested_quantity > stock_quantity:
            return Response({"message": "Stock limit reached"})
        if cart_item.quantity < 1:
            cart_item.delete() 
            return Response({"message": "Item removed from cart"})

        return Response({"quantity": cart_item.quantity})
    def delete(self,request,id):
        cart_item = get_object_or_404(CartItem, cart_item_id = id, cart__user = request.user)
        cart_item.delete()
        return Response({"message": "Item removed from cart"})
    
class ClearCart(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def delete(self,request):
        cartitem = CartItem.objects.filter(cart__user = request.user)
        cartitem.delete()
        return Response({"message": "Item removed from cart"})
    
class Registration(APIView):
    def post(self,request):
        s_obj = UserSerializer(data = request.data)
        if s_obj.is_valid():
            uobj = s_obj.save()
            uobj.set_password(s_obj.validated_data['password'])
            uobj.save()
            return Response({"message": "User created successfully"},status=HTTP_201_CREATED)
        else:
            return Response(s_obj.errors,status=HTTP_400_BAD_REQUEST)
        
class Login(APIView):
    def post(self,request):
        email = request.data.get("email")
        password = request.data.get("password")
        user_obj = User.objects.filter(email=email).first()
        if not user_obj:
            return Response(
                {"error": "User not found"},
                status=HTTP_400_BAD_REQUEST
            )
        user = authenticate(request,username = user_obj.username,password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login Successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "is_admin": user.is_staff,
                "username": user.username,
                "email": user.email
            })
        return Response(
            {"error": "Invalid credentials"},
            status=HTTP_401_UNAUTHORIZED
        )

# class Logout(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         try:
#             refresh_token = request.data["refresh"]
#             token = RefreshToken(refresh_token)
#             token.blacklist()

#             return Response({"message": "Logout successful"})
#         except Exception as e:
#             return Response({"error": "Invalid token"}, status=400)




class CreateOrder(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user = request.user
        cart_items = CartItem.objects.filter(cart__user=user).select_related("product")
        if not cart_items.exists():
            return Response({"message": "Cart is empty"}, status=HTTP_400_BAD_REQUEST)
        total = 0
        for item in cart_items:
            total += item.product.price_per_item*item.quantity

        order = Order.objects.create(user=user,total=total)
        for item in cart_items:
            OrderDetails.objects.create(order=order,product=item.product,quantity=item.quantity,
                                        total_price =item.product.price_per_item * item.quantity)
            item.product.quantity -= item.quantity
            item.product.save()
        cart_items.delete()

        return Response({
            "message": "Order placed successfully",
            "order_id": order.order_id
        }, status=HTTP_201_CREATED)
    
class UserOrders(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        orders = Order.objects.filter(user=request.user).order_by('-date_time')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
class OrderDetailsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        order = get_object_or_404(Order, order_id=id, user=request.user)
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
class CancelOrder(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def delete(self,request,id):
        try:
            order = Order.objects.get(order_id = id, user = request.user)
            if order.status == "cancelled":
                return Response({"message": "Order already cancelled"}, status=HTTP_400_BAD_REQUEST)
            order_items = OrderDetails.objects.filter(order=order)
            for item in order_items:
                item.product.quantity += item.quantity
                item.product.save()
            order.status = "cancelled"
            order.save()
            return Response({"message": "Order cancelled successfully"})

        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=HTTP_400_BAD_REQUEST)


    
class AllOrders(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = Order.objects.all().order_by('-date_time')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)