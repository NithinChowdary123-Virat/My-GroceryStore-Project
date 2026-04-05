from django.urls import path
from . import views
urlpatterns = [
    path('home/',views.Products.as_view(),name='home'),
    path('modifyproduct/<int:pk>',views.Product_Modify.as_view(),name='product_update'),
    path('uom/', views.UOM_API.as_view()),
    path('search/',views.SearchView.as_view()),
    path('register/',views.Registration.as_view()),
    path('login/',views.Login.as_view()),
    path('add-to-cart/<int:id>/',views.AddToCart.as_view()),
    path('viewcart/',views.Cart_API.as_view()),
    path('updatecart/<int:id>/',views.UpdateCart.as_view()),
    path('clearcart/',views.ClearCart.as_view()),
    path('category/',views.CategoryList.as_view()),
    path('orders/create/',views.CreateOrder.as_view()),
    path('orders/',views.UserOrders.as_view()),
    path('orders/<int:id>/',views.OrderDetailsView.as_view()),
    path('orders/<int:id>/cancel/',views.CancelOrder.as_view()),
    path('admin/orders/',views.AllOrders.as_view()),
    # path('logout/',views.Logout.as_view())
 ]