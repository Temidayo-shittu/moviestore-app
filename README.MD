## Hosted Project

[Movie-Cart](https://shopping-cart-app-wmmv.onrender.com)

#### Setup Basic Express Server

# Movie App Schema Design

## User Story

As a user, I want to be able to browse a catalog of movies and add movies to my shopping cart. 
Users can register or login to their account and are able to view the contents of their cart and adjust the quantity of items in their cart. Finally, users will be able to place an order and receive confirmation of their orders.
Users can also leave reviews and get views of other users on movies available for purchase
Only admin can create products, get access to all cart items and all orders. 

## Requirement Analysis

### Entities:

Authentication: This allows for registering and enabling users login to their account and also logging out
Movies: A catalogue has a list of movies, each with a title,quantity,price,number of movies requested,release year,etc.
Cart: This contains items from the movies catalogue selected by the users
Users: A user has a unique identifier, name, email, and password.
Orders: An order has a unique identifier, the user who placed it, a list of movies,tax,shopping fee and the total amount amongst other features.
Reviews: Users can leave reviews on a particular movie.

### Relationships:
A user can view the Movie catalogue, select items into cart and place an order.
Only items selected in cart can be ordered
A user can only access contents of carts peculiar to him
An order can contain multiple cart items.
A user has 2 categories(regular or isGold) and he/she can view reviews on a particular movie and all movies available
'isGold' users have a discount of 20% on each movie added to cart whereas 'regular' users have no discount
