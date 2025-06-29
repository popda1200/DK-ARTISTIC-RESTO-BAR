"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Plus, Minus, Star, Clock, MapPin, Phone, Utensils, Coffee } from "lucide-react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  happyHourPrice?: number
  image: string
  category: string
  rating: number
  prepTime: string
  popular?: boolean
  spicy?: boolean
}

interface CartItem extends MenuItem {
  quantity: number
  isHappyHour?: boolean
}

const menuItems: MenuItem[] = [
  // Brochettes & Grilled Items
  {
    id: "1",
    name: "Brochettes",
    description: "Traditional grilled meat skewers with spices and vegetables",
    price: 1000,
    image: "/placeholder.svg?height=200&width=300",
    category: "brochettes",
    rating: 4.8,
    prepTime: "10-15 min",
    popular: true,
  },
  {
    id: "2",
    name: "Double-Beef Brochette",
    description: "Double portion of tender beef brochettes with special seasoning",
    price: 2000,
    image: "/placeholder.svg?height=200&width=300",
    category: "brochettes",
    rating: 4.9,
    prepTime: "12-18 min",
    popular: true,
  },
  {
    id: "3",
    name: "Pork Brochettes",
    description: "Juicy pork skewers marinated in local spices",
    price: 7000,
    image: "/placeholder.svg?height=200&width=300",
    category: "brochettes",
    rating: 4.7,
    prepTime: "15-20 min",
  },
  // Sides & Fries
  {
    id: "4",
    name: "Loaded Fries",
    description: "Crispy fries topped with cheese, bacon bits, and special street sauce",
    price: 2500,
    image: "/placeholder.svg?height=200&width=300",
    category: "sides",
    rating: 4.6,
    prepTime: "8-12 min",
    popular: true,
  },
  {
    id: "5",
    name: "Street Fries",
    description: "Classic crispy fries with salt and pepper",
    price: 1500,
    image: "/placeholder.svg?height=200&width=300",
    category: "sides",
    rating: 4.4,
    prepTime: "5-8 min",
  },
  // Burgers
  {
    id: "6",
    name: "DK Special Burger",
    description: "Double beef patty, cheese, lettuce, tomato, special sauce on brioche bun",
    price: 8500,
    image: "/placeholder.svg?height=200&width=300",
    category: "burgers",
    rating: 4.8,
    prepTime: "8-12 min",
    popular: true,
  },
  {
    id: "7",
    name: "Chicken Burger",
    description: "Grilled chicken breast with lettuce, tomato, and mayo",
    price: 6500,
    image: "/placeholder.svg?height=200&width=300",
    category: "burgers",
    rating: 4.5,
    prepTime: "10-15 min",
  },
  // Drinks - Bralirwa
  {
    id: "8",
    name: "Mutzig Beer",
    description: "Ice-cold Mutzig beer - Rwanda's favorite",
    price: 1500,
    happyHourPrice: 1200,
    image: "/placeholder.svg?height=200&width=300",
    category: "beer",
    rating: 4.3,
    prepTime: "1 min",
  },
  {
    id: "9",
    name: "Primus Beer",
    description: "Fresh Primus beer served ice-cold",
    price: 1500,
    happyHourPrice: 1200,
    image: "/placeholder.svg?height=200&width=300",
    category: "beer",
    rating: 4.2,
    prepTime: "1 min",
  },
  {
    id: "10",
    name: "Turbo King",
    description: "Strong beer for those who want extra kick",
    price: 2000,
    happyHourPrice: 1600,
    image: "/placeholder.svg?height=200&width=300",
    category: "beer",
    rating: 4.4,
    prepTime: "1 min",
  },
  // Cocktails & Specials
  {
    id: "11",
    name: "DK Signature Cocktail",
    description: "House special mix with premium spirits and fresh fruits",
    price: 8000,
    happyHourPrice: 6000,
    image: "/placeholder.svg?height=200&width=300",
    category: "cocktails",
    rating: 4.9,
    prepTime: "3-5 min",
    popular: true,
  },
  {
    id: "12",
    name: "Street Mojito",
    description: "Fresh mint, lime, rum, and soda water with a street twist",
    price: 7000,
    happyHourPrice: 5500,
    image: "/placeholder.svg?height=200&width=300",
    category: "cocktails",
    rating: 4.6,
    prepTime: "3-5 min",
  },
]

// Gallery images with food photos
const galleryImages = [
  {
    id: 1,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Delicious brochettes on the grill",
    title: "Fresh Brochettes",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Loaded fries with toppings",
    title: "Loaded Fries",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Restaurant interior with street vibe",
    title: "Our Atmosphere",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Cold Bralirwa beers",
    title: "Ice Cold Beers",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=300&width=400",
    alt: "DK Special Burger",
    title: "Signature Burgers",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Cocktails and drinks",
    title: "Craft Cocktails",
  },
  {
    id: 7,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Street food preparation",
    title: "Fresh Preparation",
  },
  {
    id: 8,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Happy customers enjoying food",
    title: "Happy Customers",
  },
]

export default function RestaurantEcommerce() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [diningOption, setDiningOption] = useState<"takeout" | "dinein">("takeout")
  const [isLoaded, setIsLoaded] = useState(false)

  // Animation effect on page load
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Happy Hour: 4 PM - 7 PM
  const isHappyHour = () => {
    const now = new Date()
    const hour = now.getHours()
    return hour >= 16 && hour < 19
  }

  const categories = [
    { id: "all", name: "All Items", icon: Utensils },
    { id: "brochettes", name: "Brochettes", icon: Utensils },
    { id: "burgers", name: "Burgers", icon: Utensils },
    { id: "sides", name: "Sides & Fries", icon: Utensils },
    { id: "beer", name: "Bralirwa Beers", icon: Coffee },
    { id: "cocktails", name: "Cocktails", icon: Coffee },
  ]

  const filteredItems =
    activeCategory === "all" ? menuItems : menuItems.filter((item) => item.category === activeCategory)

  const addToCart = (item: MenuItem) => {
    const effectivePrice = isHappyHour() && item.happyHourPrice ? item.happyHourPrice : item.price
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [
        ...prevCart,
        { ...item, quantity: 1, price: effectivePrice, isHappyHour: isHappyHour() && !!item.happyHourPrice },
      ]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === itemId)
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem,
        )
      }
      return prevCart.filter((cartItem) => cartItem.id !== itemId)
    })
  }

  const getCartItemQuantity = (itemId: string) => {
    const item = cart.find((cartItem) => cartItem.id === itemId)
    return item ? item.quantity : 0
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getEffectivePrice = (item: MenuItem) => {
    return isHappyHour() && item.happyHourPrice ? item.happyHourPrice : item.price
  }

  const scrollToMenu = () => {
    document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div
      className={`min-h-screen bg-orange-50 font-sans transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-50 w-full border-b bg-amber-900/95 backdrop-blur supports-[backdrop-filter]:bg-amber-900/90 text-white transition-all duration-700 delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"}`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-amber-100">DK ARTISTIC RESTO&BAR</h1>
            <Badge variant="secondary" className="bg-amber-700 text-amber-100">
              All Fast Foods
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4 text-sm text-amber-200">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Kigali Masoro</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>+250782292053</span>
              </div>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative bg-amber-800 border-amber-600 text-amber-100 hover:bg-amber-700"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="ml-2">Cart</span>
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-orange-500">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Your Order</SheetTitle>
                  <SheetDescription>Review your items before checkout</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  {/* Dining Option Selection */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Dining Option</h4>
                    <div className="flex space-x-2">
                      <Button
                        variant={diningOption === "takeout" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDiningOption("takeout")}
                        className="flex-1"
                      >
                        Takeout
                      </Button>
                      <Button
                        variant={diningOption === "dinein" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDiningOption("dinein")}
                        className="flex-1"
                      >
                        Dine In
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <div className="text-sm text-muted-foreground">
                              <span>RWF {item.price.toLocaleString()} each</span>
                              {item.isHappyHour && <Badge className="ml-2 text-xs bg-orange-500">Happy Hour</Badge>}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => addToCart(item)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>RWF {getTotalPrice().toLocaleString()}</span>
                        </div>
                        {diningOption === "takeout" && (
                          <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span>RWF 2,000</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Tax (18%)</span>
                          <span>RWF {Math.round(getTotalPrice() * 0.18).toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>
                            RWF{" "}
                            {(
                              getTotalPrice() +
                              (diningOption === "takeout" ? 2000 : 0) +
                              getTotalPrice() * 0.18
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <Button className="w-full bg-amber-700 hover:bg-amber-800" size="lg">
                        Proceed to Checkout
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Happy Hour Alert */}
      {isHappyHour() && (
        <Alert
          className={`mx-4 mt-4 bg-orange-100 border-orange-300 transition-all duration-700 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Clock className="h-4 w-4" />
          <AlertDescription className="font-medium text-orange-800">
            🎉 Happy Hour is ON! Get special prices on selected drinks until 7 PM!
          </AlertDescription>
        </Alert>
      )}

      {/* Hero Section */}
      <section
        className={`relative h-[500px] bg-gradient-to-r from-amber-600 to-orange-600 bg-cover bg-center text-white text-center flex items-center justify-center transition-all duration-1000 delay-400 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 space-y-6">
          <h1
            className={`text-5xl md:text-6xl font-bold transition-all duration-1000 delay-600 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            DK ARTISTIC RESTO & BAR
          </h1>
          <p
            className={`text-xl md:text-2xl transition-all duration-1000 delay-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Kigali's No.1 Street Food Haven in Masoro
          </p>
          <Button
            onClick={scrollToMenu}
            className={`bg-amber-700 hover:bg-amber-800 text-white text-lg px-8 py-3 transition-all duration-1000 delay-800 transform hover:scale-105 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Explore Menu
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section
        className={`p-10 bg-white text-gray-800 transition-all duration-1000 delay-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-amber-900">About Us</h2>
          <p className="text-lg leading-relaxed">
            At DK ARTISTIC RESTO & BAR, we bring the vibrant taste of street food to the heart of Kigali. From sizzling
            brochettes to crispy fries, we're all about fast, flavorful, and fresh eats. Grab a bite and feel the vibe!
            Our passion is serving authentic street food with a modern twist, using the freshest ingredients and
            traditional cooking methods.
          </p>
        </div>
      </section>

      {/* Menu Section */}
      <section
        id="menu-section"
        className={`p-10 bg-orange-100 transition-all duration-1000 delay-600 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="container">
          <h2 className="text-3xl font-bold mb-6 text-amber-900 text-center">Our Street Menu</h2>

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-amber-100 mb-8">
              {categories.map((category, index) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className={`data-[state=active]:bg-amber-700 data-[state=active]:text-white transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: `${700 + index * 100}ms` }}
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, index) => (
                  <Card
                    key={item.id}
                    className={`overflow-hidden border-amber-200 hover:shadow-lg transition-all duration-500 bg-white transform hover:scale-105 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: `${800 + index * 100}ms` }}
                  >
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-2 left-2 flex gap-2">
                        {item.popular && <Badge className="bg-orange-500 animate-pulse">Popular</Badge>}
                        {item.spicy && <Badge className="bg-red-500">🌶️ Spicy</Badge>}
                        {isHappyHour() && item.happyHourPrice && (
                          <Badge className="bg-yellow-500 text-black animate-bounce">Happy Hour</Badge>
                        )}
                      </div>
                    </div>

                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-semibold text-amber-900">{item.name}</CardTitle>
                        <div className="text-right">
                          {isHappyHour() && item.happyHourPrice ? (
                            <div>
                              <span className="text-sm line-through text-muted-foreground">
                                RWF {item.price.toLocaleString()}
                              </span>
                              <div className="text-lg font-bold text-orange-600">
                                RWF {item.happyHourPrice.toLocaleString()}
                              </div>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-amber-700">RWF {item.price.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <CardDescription className="text-gray-600">{item.description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{item.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{item.prepTime}</span>
                          </div>
                        </div>
                      </div>

                      {getCartItemQuantity(item.id) > 0 ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              className="border-amber-300 hover:bg-amber-100 transition-all duration-200 hover:scale-110"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{getCartItemQuantity(item.id)}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => addToCart(item)}
                              className="border-amber-300 hover:bg-amber-100 transition-all duration-200 hover:scale-110"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            RWF {(getEffectivePrice(item) * getCartItemQuantity(item.id)).toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <Button
                          className="w-full bg-amber-700 hover:bg-amber-800 transition-all duration-200 hover:scale-105"
                          onClick={() => addToCart(item)}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Gallery Section */}
      <section
        className={`p-10 bg-white transition-all duration-1000 delay-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="container">
          <h2 className="text-3xl font-bold mb-6 text-amber-900 text-center">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                className={`relative bg-gray-200 h-40 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-500 cursor-pointer group transform hover:scale-105 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${900 + index * 100}ms` }}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-medium text-sm text-center px-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {image.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opening Hours & Contact */}
      <section
        className={`p-10 bg-orange-100 text-gray-800 transition-all duration-1000 delay-800 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="container">
          <h2 className="text-3xl font-bold mb-6 text-amber-900 text-center">Find Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div
              className={`flex items-start space-x-3 text-center md:text-left transition-all duration-700 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
              style={{ transitionDelay: "1000ms" }}
            >
              <MapPin className="text-amber-700 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-900">Location</p>
                <p>349W+2C8, Kigali Masoro</p>
                <p className="text-sm text-gray-600">Easy to find, great parking</p>
              </div>
            </div>
            <div
              className={`flex items-start space-x-3 text-center md:text-left transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "1100ms" }}
            >
              <Clock className="text-amber-700 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-900">Opening Hours</p>
                <p>Mon - Sun: 10:00 AM - 11:00 PM</p>
                <p className="text-sm text-orange-600 font-medium">Happy Hour: 4:00 PM - 7:00 PM</p>
              </div>
            </div>
            <div
              className={`flex items-start space-x-3 text-center md:text-left transition-all duration-700 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
              style={{ transitionDelay: "1200ms" }}
            >
              <Phone className="text-amber-700 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-900">Contact</p>
                <p>+250782292053</p>
                <p className="text-sm text-gray-600">Call for reservations & orders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`bg-amber-900 text-amber-100 py-12 transition-all duration-1000 delay-900 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`transition-all duration-700 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
              style={{ transitionDelay: "1300ms" }}
            >
              <h3 className="font-bold text-lg mb-4">DK ARTISTIC RESTO&BAR</h3>
              <p className="text-amber-200 mb-4">
                Serving the best street food and craft drinks in Kigali since 2020. Fast, fresh, and full of flavor!
              </p>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-2 text-sm text-amber-200">4.7/5</span>
              </div>
            </div>

            <div
              className={`transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "1400ms" }}
            >
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-sm text-amber-200">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>349W+2C8, Kigali Masoro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+250782292053</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Daily: 10:00 AM - 11:00 PM</span>
                </div>
                <div className="text-orange-300 font-medium">Happy Hour: 4:00 PM - 7:00 PM (Drinks Only)</div>
              </div>
            </div>

            <div
              className={`transition-all duration-700 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
              style={{ transitionDelay: "1500ms" }}
            >
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm text-amber-200">
                <div className="hover:text-orange-300 transition-colors cursor-pointer">About Us</div>
                <div className="hover:text-orange-300 transition-colors cursor-pointer">Menu</div>
                <div className="hover:text-orange-300 transition-colors cursor-pointer">Gallery</div>
                <div className="hover:text-orange-300 transition-colors cursor-pointer">Contact</div>
                <button
                  onClick={() => (window.location.href = "/admin")}
                  className="text-left hover:text-orange-300 transition-colors cursor-pointer"
                >
                  Admin Panel
                </button>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-amber-700" />

          <div
            className={`text-center text-sm text-amber-200 transition-all duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "1600ms" }}
          >
            © 2024 DK ARTISTIC RESTO&BAR. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
