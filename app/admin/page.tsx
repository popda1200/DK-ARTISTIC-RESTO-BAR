"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  Save,
  X,
  ArrowLeft,
  Key,
  Eye,
  EyeOff,
  Upload,
  ImageIcon,
  Download,
  Copy,
  ExternalLink,
  MapPin,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

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
  available?: boolean
  calories?: number
  ingredients?: string[]
  allergens?: string[]
  cost?: number
  soldCount?: number
  lastOrdered?: string
  createdAt?: string
  updatedAt?: string
}

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAddress?: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    notes?: string
  }>
  total: number
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled"
  orderType: "takeout" | "dinein"
  orderTime: string
  estimatedTime?: string
  deliveryTime?: string
  paymentMethod?: string
  paymentStatus?: string
  notes?: string
  tableNumber?: string
  createdAt?: string
  updatedAt?: string
}

interface AdminUser {
  username: string
  password: string
  email: string
  phone: string
  securityQuestion: string
  securityAnswer: string
  role: "admin" | "manager" | "staff"
  lastLogin?: string
  isActive: boolean
  firstName?: string
  lastName?: string
  avatar?: string
  permissions?: string[]
  createdAt?: string
  updatedAt?: string
}

interface RestaurantSettings {
  name: string
  description: string
  address: string
  phone: string
  email: string
  website?: string
  logo?: string
  coverImage?: string
  openingHours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }
  happyHour: {
    enabled: boolean
    start: string
    end: string
    days: string[]
  }
  delivery: {
    enabled: boolean
    fee: number
    freeDeliveryThreshold: number
    radius: number
  }
  tax: {
    rate: number
    included: boolean
  }
  currency: string
  timezone: string
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
    whatsapp?: string
  }
}

const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "DK Special Burger",
    description: "Double beef patty, cheese, lettuce, tomato, special sauce on brioche bun",
    price: 8500,
    image: "/placeholder.svg?height=200&width=300",
    category: "burgers",
    rating: 4.8,
    prepTime: "8-12 min",
    popular: true,
    available: true,
    calories: 720,
    ingredients: ["Double Beef Patty", "Cheese", "Lettuce", "Tomato", "Brioche Bun", "Special Sauce"],
    allergens: ["Gluten", "Dairy"],
    cost: 4000,
    soldCount: 156,
    lastOrdered: "2024-01-20",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    name: "Crispy Chicken Wings",
    description: "6 pieces of crispy wings with choice of sauce: BBQ, Buffalo, or Honey Garlic",
    price: 6500,
    image: "/placeholder.svg?height=200&width=300",
    category: "chicken",
    rating: 4.7,
    prepTime: "10-15 min",
    spicy: true,
    available: true,
    calories: 480,
    ingredients: ["Chicken Wings", "Sauce", "Spices", "Oil"],
    allergens: ["Soy"],
    cost: 3000,
    soldCount: 89,
    lastOrdered: "2024-01-19",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-19",
  },
  {
    id: "3",
    name: "Street Fries",
    description: "Crispy fries topped with cheese, bacon bits, and special street sauce",
    price: 4500,
    image: "/placeholder.svg?height=200&width=300",
    category: "sides",
    rating: 4.6,
    prepTime: "5-8 min",
    popular: true,
    available: true,
    calories: 580,
    ingredients: ["Potatoes", "Cheese", "Bacon", "Special Sauce", "Herbs"],
    allergens: ["Dairy"],
    cost: 1500,
    soldCount: 234,
    lastOrdered: "2024-01-20",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-20",
  },
  {
    id: "4",
    name: "DK Signature Cocktail",
    description: "House special mix with premium spirits and fresh fruits",
    price: 8000,
    happyHourPrice: 6000,
    image: "/placeholder.svg?height=200&width=300",
    category: "cocktails",
    rating: 4.9,
    prepTime: "3-5 min",
    popular: true,
    available: true,
    calories: 220,
    ingredients: ["Premium Spirits", "Fresh Fruits", "Mixers", "Ice"],
    allergens: [],
    cost: 3500,
    soldCount: 78,
    lastOrdered: "2024-01-18",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-18",
  },
]

const initialOrders: Order[] = [
  {
    id: "ORD001",
    customerName: "John Doe",
    customerPhone: "+250788123456",
    customerEmail: "john@example.com",
    customerAddress: "KG 123 St, Kigali",
    items: [
      { id: "1", name: "DK Special Burger", quantity: 2, price: 8500, notes: "No onions" },
      { id: "3", name: "Street Fries", quantity: 1, price: 4500 },
    ],
    total: 21500,
    status: "preparing",
    orderType: "dinein",
    orderTime: "2024-01-15 14:30",
    estimatedTime: "15 min",
    paymentMethod: "Cash",
    paymentStatus: "Paid",
    tableNumber: "T-05",
    notes: "Customer prefers well-done burger",
    createdAt: "2024-01-15 14:30",
    updatedAt: "2024-01-15 14:35",
  },
  {
    id: "ORD002",
    customerName: "Jane Smith",
    customerPhone: "+250788654321",
    customerEmail: "jane@example.com",
    customerAddress: "KG 456 St, Kigali",
    items: [
      { id: "4", name: "DK Signature Cocktail", quantity: 2, price: 6000 },
      { id: "2", name: "Crispy Chicken Wings", quantity: 1, price: 6500, notes: "Extra spicy" },
    ],
    total: 18500,
    status: "ready",
    orderType: "takeout",
    orderTime: "2024-01-15 15:15",
    estimatedTime: "10 min",
    paymentMethod: "Mobile Money",
    paymentStatus: "Paid",
    notes: "Call when ready for pickup",
    createdAt: "2024-01-15 15:15",
    updatedAt: "2024-01-15 15:25",
  },
]

const categories = [
  {
    id: "burgers",
    name: "Burgers",
    description: "Juicy burgers with fresh ingredients",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "chicken",
    name: "Chicken",
    description: "Crispy and tender chicken dishes",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "wraps",
    name: "Wraps",
    description: "Fresh wraps with various fillings",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "fish",
    name: "Fish",
    description: "Fresh fish prepared to perfection",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "sides",
    name: "Sides",
    description: "Delicious side dishes and appetizers",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "cocktails",
    name: "Cocktails",
    description: "Handcrafted cocktails and mixed drinks",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "beer",
    name: "Beer",
    description: "Cold beers and local favorites",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "beverages",
    name: "Beverages",
    description: "Refreshing drinks and soft beverages",
    image: "/placeholder.svg?height=100&width=100",
  },
]

const adminUsers: AdminUser[] = [
  {
    username: "Kayitesi diane",
    password: "12345678910",
    email: "kayitesi@dkartistic.com",
    phone: "+250782292053",
    securityQuestion: "What is the name of your first restaurant?",
    securityAnswer: "dk artistic",
    role: "admin",
    lastLogin: "2024-01-15 10:30",
    isActive: true,
    firstName: "Kayitesi",
    lastName: "Diane",
    avatar: "/placeholder.svg?height=100&width=100",
    permissions: ["all"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    username: "manager1",
    password: "manager123",
    email: "manager@dkartistic.com",
    phone: "+250788999888",
    securityQuestion: "What is your favorite food?",
    securityAnswer: "burger",
    role: "manager",
    lastLogin: "2024-01-14 16:45",
    isActive: true,
    firstName: "John",
    lastName: "Manager",
    avatar: "/placeholder.svg?height=100&width=100",
    permissions: ["menu", "orders", "customers"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-14",
  },
]

const initialRestaurantSettings: RestaurantSettings = {
  name: "DK ARTISTIC RESTO&BAR",
  description: "At DK ARTISTIC RESTO & BAR, we bring the vibrant taste of street food to the heart of Kigali.",
  address: "349W+2C8, Kigali Masoro",
  phone: "+250782292053",
  email: "info@dkartistic.com",
  website: "https://dkartistic.com",
  logo: "/placeholder.svg?height=100&width=100",
  coverImage: "/placeholder.svg?height=300&width=600",
  openingHours: {
    monday: { open: "10:00", close: "23:00", closed: false },
    tuesday: { open: "10:00", close: "23:00", closed: false },
    wednesday: { open: "10:00", close: "23:00", closed: false },
    thursday: { open: "10:00", close: "23:00", closed: false },
    friday: { open: "10:00", close: "23:00", closed: false },
    saturday: { open: "10:00", close: "23:00", closed: false },
    sunday: { open: "10:00", close: "23:00", closed: false },
  },
  happyHour: {
    enabled: true,
    start: "16:00",
    end: "19:00",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  },
  delivery: {
    enabled: true,
    fee: 2000,
    freeDeliveryThreshold: 20000,
    radius: 10,
  },
  tax: {
    rate: 18,
    included: false,
  },
  currency: "RWF",
  timezone: "Africa/Kigali",
  socialMedia: {
    facebook: "https://facebook.com/dkartistic",
    instagram: "https://instagram.com/dkartistic",
    twitter: "https://twitter.com/dkartistic",
    whatsapp: "+250782292053",
  },
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)

  // Password Recovery States
  const [currentView, setCurrentView] = useState<"login" | "forgot-password" | "verify-identity" | "reset-password">(
    "login",
  )
  const [recoveryForm, setRecoveryForm] = useState({
    username: "",
    email: "",
    phone: "",
    securityAnswer: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [recoveryStep, setRecoveryStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null)

  // Menu Management States
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Order Management States
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [orderFilter, setOrderFilter] = useState("all")
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)

  // User Management States
  const [users, setUsers] = useState<AdminUser[]>(adminUsers)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [newUser, setNewUser] = useState<Partial<AdminUser>>({
    username: "",
    password: "",
    email: "",
    phone: "",
    securityQuestion: "",
    securityAnswer: "",
    role: "staff",
    isActive: true,
    firstName: "",
    lastName: "",
    avatar: "/placeholder.svg?height=100&width=100",
    permissions: [],
  })

  // Settings States
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings>(initialRestaurantSettings)
  const [editingSettings, setEditingSettings] = useState(false)

  // Analytics States
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 450000,
    totalOrders: 156,
    avgOrderValue: 2885,
    popularItems: ["DK Special Burger", "Street Fries", "DK Signature Cocktail"],
    revenueByDay: [
      { date: "2024-01-15", revenue: 45000 },
      { date: "2024-01-16", revenue: 52000 },
      { date: "2024-01-17", revenue: 38000 },
      { date: "2024-01-18", revenue: 61000 },
      { date: "2024-01-19", revenue: 47000 },
      { date: "2024-01-20", revenue: 58000 },
    ],
  })

  // Messages
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    happyHourPrice: 0,
    image: "/placeholder.svg?height=200&width=300",
    category: "burgers",
    rating: 4.0,
    prepTime: "",
    popular: false,
    spicy: false,
    available: true,
    calories: 0,
    ingredients: [],
    allergens: [],
    cost: 0,
  })

  // Utility Functions
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const showErrorMessage = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(""), 3000)
  }

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const sendVerificationCode = (method: "email" | "sms", contact: string) => {
    const code = generateVerificationCode()
    setGeneratedCode(code)
    console.log(`Verification code ${code} sent to ${contact} via ${method}`)
    showSuccessMessage(
      `Verification code sent to ${method === "email" ? "email" : "phone number"} ending in ${contact.slice(-4)}`,
    )
  }

  // Image handling functions
  const handleImageUpload = (file: File, callback: (url: string) => void) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        callback(result)
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    } else {
      showErrorMessage("Please select a valid image file")
    }
  }

  const handleImageUrlChange = (url: string, callback: (url: string) => void) => {
    if (url.trim()) {
      callback(url)
      setImagePreview(url)
    }
  }

  // Authentication Functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const admin = users.find(
      (acc) => acc.username === loginForm.username && acc.password === loginForm.password && acc.isActive,
    )

    if (admin) {
      setIsAuthenticated(true)
      setCurrentUser(admin)
      admin.lastLogin = new Date().toLocaleString()
      showSuccessMessage("Welcome to DK Admin Dashboard!")
    } else {
      showErrorMessage("Invalid credentials or account is inactive.")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setLoginForm({ username: "", password: "" })
    setActiveTab("dashboard")
  }

  // Password Recovery Functions
  const handleForgotPasswordStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    const admin = users.find((acc) => acc.username === recoveryForm.username)

    if (admin) {
      setSelectedAdmin(admin)
      setCurrentView("verify-identity")
      setRecoveryStep(2)
    } else {
      showErrorMessage("Username not found. Please check and try again.")
    }
  }

  const handleVerifyIdentity = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAdmin) return

    const emailMatch = recoveryForm.email === selectedAdmin.email
    const phoneMatch = recoveryForm.phone === selectedAdmin.phone

    if (emailMatch || phoneMatch) {
      if (emailMatch) {
        sendVerificationCode("email", selectedAdmin.email)
      } else {
        sendVerificationCode("sms", selectedAdmin.phone)
      }
      setRecoveryStep(3)
    } else {
      showErrorMessage("Email or phone number doesn't match our records.")
    }
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (verificationCode === generatedCode) {
      setRecoveryStep(4)
      showSuccessMessage("Identity verified! Please answer the security question.")
    } else {
      showErrorMessage("Invalid verification code. Please try again.")
    }
  }

  const handleSecurityQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAdmin) return

    if (recoveryForm.securityAnswer.toLowerCase().trim() === selectedAdmin.securityAnswer.toLowerCase()) {
      setCurrentView("reset-password")
      setRecoveryStep(5)
      showSuccessMessage("Security question answered correctly! You can now reset your password.")
    } else {
      showErrorMessage("Incorrect answer to security question.")
    }
  }

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault()

    if (recoveryForm.newPassword !== recoveryForm.confirmPassword) {
      showErrorMessage("Passwords don't match. Please try again.")
      return
    }

    if (recoveryForm.newPassword.length < 8) {
      showErrorMessage("Password must be at least 8 characters long.")
      return
    }

    const userIndex = users.findIndex((acc) => acc.username === selectedAdmin?.username)
    if (userIndex !== -1) {
      const updatedUsers = [...users]
      updatedUsers[userIndex].password = recoveryForm.newPassword
      updatedUsers[userIndex].updatedAt = new Date().toISOString()
      setUsers(updatedUsers)
    }

    showSuccessMessage("Password reset successfully! You can now login with your new password.")
    setTimeout(() => {
      resetRecoveryForm()
      setCurrentView("login")
    }, 3000)
  }

  const resetRecoveryForm = () => {
    setRecoveryForm({
      username: "",
      email: "",
      phone: "",
      securityAnswer: "",
      newPassword: "",
      confirmPassword: "",
    })
    setRecoveryStep(1)
    setVerificationCode("")
    setGeneratedCode("")
    setSelectedAdmin(null)
  }

  // Menu Management Functions
  const handleAddItem = () => {
    if (!newItem.name || !newItem.description || !newItem.price) {
      showErrorMessage("Please fill in all required fields")
      return
    }

    const item: MenuItem = {
      id: generateId(),
      name: newItem.name!,
      description: newItem.description!,
      price: newItem.price!,
      happyHourPrice: newItem.happyHourPrice || undefined,
      image: newItem.image!,
      category: newItem.category!,
      rating: newItem.rating!,
      prepTime: newItem.prepTime!,
      popular: newItem.popular!,
      spicy: newItem.spicy!,
      available: newItem.available!,
      calories: newItem.calories!,
      ingredients: newItem.ingredients!,
      allergens: newItem.allergens!,
      cost: newItem.cost!,
      soldCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setMenuItems([...menuItems, item])
    setIsAddingNew(false)
    setNewItem({
      name: "",
      description: "",
      price: 0,
      happyHourPrice: 0,
      image: "/placeholder.svg?height=200&width=300",
      category: "burgers",
      rating: 4.0,
      prepTime: "",
      popular: false,
      spicy: false,
      available: true,
      calories: 0,
      ingredients: [],
      allergens: [],
      cost: 0,
    })
    setImagePreview(null)
    showSuccessMessage("Product added successfully!")
  }

  const handleEditItem = (item: MenuItem) => {
    setEditingItem({ ...item })
    setImagePreview(item.image)
  }

  const handleUpdateItem = () => {
    if (!editingItem) return

    const updatedItem = {
      ...editingItem,
      updatedAt: new Date().toISOString(),
    }

    setMenuItems(menuItems.map((item) => (item.id === editingItem.id ? updatedItem : item)))
    setEditingItem(null)
    setImagePreview(null)
    showSuccessMessage("Product updated successfully!")
  }

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setMenuItems(menuItems.filter((item) => item.id !== id))
      showSuccessMessage("Product deleted successfully!")
    }
  }

  const toggleAvailability = (id: string) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, available: !item.available, updatedAt: new Date().toISOString() } : item,
      ),
    )
  }

  const duplicateItem = (item: MenuItem) => {
    const duplicatedItem: MenuItem = {
      ...item,
      id: generateId(),
      name: `${item.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setMenuItems([...menuItems, duplicatedItem])
    showSuccessMessage("Product duplicated successfully!")
  }

  // Order Management Functions
  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order,
      ),
    )
    showSuccessMessage(`Order ${orderId} status updated to ${newStatus}`)
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder({ ...order })
  }

  const handleUpdateOrder = () => {
    if (!editingOrder) return

    const updatedOrder = {
      ...editingOrder,
      updatedAt: new Date().toISOString(),
    }

    setOrders(orders.map((order) => (order.id === editingOrder.id ? updatedOrder : order)))
    setEditingOrder(null)
    showSuccessMessage("Order updated successfully!")
  }

  const handleDeleteOrder = (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter((order) => order.id !== id))
      showSuccessMessage("Order deleted successfully!")
    }
  }

  const duplicateOrder = (order: Order) => {
    const duplicatedOrder: Order = {
      ...order,
      id: `ORD${Date.now()}`,
      status: "pending",
      orderTime: new Date().toLocaleString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setOrders([...orders, duplicatedOrder])
    showSuccessMessage("Order duplicated successfully!")
  }

  // User Management Functions
  const handleAddUser = () => {
    if (!newUser.username || !newUser.password || !newUser.email) {
      showErrorMessage("Please fill in all required fields")
      return
    }

    if (users.find((user) => user.username === newUser.username)) {
      showErrorMessage("Username already exists")
      return
    }

    const user: AdminUser = {
      username: newUser.username!,
      password: newUser.password!,
      email: newUser.email!,
      phone: newUser.phone!,
      securityQuestion: newUser.securityQuestion!,
      securityAnswer: newUser.securityAnswer!,
      role: newUser.role!,
      isActive: newUser.isActive!,
      firstName: newUser.firstName!,
      lastName: newUser.lastName!,
      avatar: newUser.avatar!,
      permissions: newUser.permissions!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setUsers([...users, user])
    setIsAddingUser(false)
    setNewUser({
      username: "",
      password: "",
      email: "",
      phone: "",
      securityQuestion: "",
      securityAnswer: "",
      role: "staff",
      isActive: true,
      firstName: "",
      lastName: "",
      avatar: "/placeholder.svg?height=100&width=100",
      permissions: [],
    })
    showSuccessMessage("User added successfully!")
  }

  const handleEditUser = (user: AdminUser) => {
    setEditingUser({ ...user })
  }

  const handleUpdateUser = () => {
    if (!editingUser) return

    const updatedUser = {
      ...editingUser,
      updatedAt: new Date().toISOString(),
    }

    setUsers(users.map((user) => (user.username === editingUser.username ? updatedUser : user)))
    setEditingUser(null)
    showSuccessMessage("User updated successfully!")
  }

  const handleDeleteUser = (username: string) => {
    if (username === currentUser?.username) {
      showErrorMessage("Cannot delete your own account")
      return
    }
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.username !== username))
      showSuccessMessage("User deleted successfully!")
    }
  }

  const toggleUserStatus = (username: string) => {
    if (username === currentUser?.username) {
      showErrorMessage("Cannot deactivate your own account")
      return
    }
    setUsers(
      users.map((user) =>
        user.username === username ? { ...user, isActive: !user.isActive, updatedAt: new Date().toISOString() } : user,
      ),
    )
  }

  // Settings Functions
  const handleUpdateSettings = () => {
    setRestaurantSettings({ ...restaurantSettings })
    setEditingSettings(false)
    showSuccessMessage("Settings updated successfully!")
  }

  // Export Functions
  const exportData = (type: "menu" | "orders" | "users" | "settings") => {
    let data: any[] = []
    let filename = ""

    switch (type) {
      case "menu":
        data = menuItems
        filename = "menu-items.json"
        break
      case "orders":
        data = orders
        filename = "orders.json"
        break
      case "users":
        data = users
        filename = "users.json"
        break
      case "settings":
        data = [restaurantSettings]
        filename = "restaurant-settings.json"
        break
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    showSuccessMessage(`${type} data exported successfully!`)
  }

  // Filter Functions
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const filteredOrders = orders.filter((order) => {
    return orderFilter === "all" || order.status === orderFilter
  })

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-amber-900">
              {currentView === "login" && "DK Admin Login"}
              {currentView === "forgot-password" && "Password Recovery"}
              {currentView === "verify-identity" && "Verify Identity"}
              {currentView === "reset-password" && "Reset Password"}
            </CardTitle>
            <CardDescription>
              {currentView === "login" && "Access the restaurant management dashboard"}
              {currentView === "forgot-password" && "Enter your username to start password recovery"}
              {currentView === "verify-identity" && "Verify your identity to continue"}
              {currentView === "reset-password" && "Create a new password for your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Success/Error Messages */}
            {successMessage && (
              <Alert className="mb-4 bg-green-100 border-green-300">
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
            )}
            {errorMessage && (
              <Alert className="mb-4 bg-red-100 border-red-300">
                <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            {currentView === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Enter password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800">
                  Login
                </Button>
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setCurrentView("forgot-password")}
                    className="text-amber-700 hover:text-amber-800"
                  >
                    Forgot Password?
                  </Button>
                </div>
              </form>
            )}

            {/* Password Recovery Forms */}
            {currentView === "forgot-password" && (
              <form onSubmit={handleForgotPasswordStep1} className="space-y-4">
                <div>
                  <Label htmlFor="recovery-username">Username</Label>
                  <Input
                    id="recovery-username"
                    type="text"
                    value={recoveryForm.username}
                    onChange={(e) => setRecoveryForm({ ...recoveryForm, username: e.target.value })}
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800">
                  Continue
                </Button>
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setCurrentView("login")
                      resetRecoveryForm()
                    }}
                    className="text-amber-700 hover:text-amber-800"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Login
                  </Button>
                </div>
              </form>
            )}

            {currentView === "verify-identity" && (
              <div className="space-y-4">
                {recoveryStep === 2 && (
                  <form onSubmit={handleVerifyIdentity} className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      Please provide either your email or phone number to verify your identity.
                    </div>
                    <div>
                      <Label htmlFor="recovery-email">Email Address</Label>
                      <Input
                        id="recovery-email"
                        type="email"
                        value={recoveryForm.email}
                        onChange={(e) => setRecoveryForm({ ...recoveryForm, email: e.target.value })}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="text-center text-sm text-gray-500">OR</div>
                    <div>
                      <Label htmlFor="recovery-phone">Phone Number</Label>
                      <Input
                        id="recovery-phone"
                        type="tel"
                        value={recoveryForm.phone}
                        onChange={(e) => setRecoveryForm({ ...recoveryForm, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800">
                      Send Verification Code
                    </Button>
                  </form>
                )}

                {recoveryStep === 3 && (
                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      Enter the 6-digit verification code sent to your {recoveryForm.email ? "email" : "phone"}.
                    </div>
                    <div>
                      <Label htmlFor="verification-code">Verification Code</Label>
                      <Input
                        id="verification-code"
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800">
                      Verify Code
                    </Button>
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                          if (recoveryForm.email) {
                            sendVerificationCode("email", selectedAdmin?.email || "")
                          } else {
                            sendVerificationCode("sms", selectedAdmin?.phone || "")
                          }
                        }}
                        className="text-amber-700 hover:text-amber-800 text-sm"
                      >
                        Resend Code
                      </Button>
                    </div>
                  </form>
                )}

                {recoveryStep === 4 && (
                  <form onSubmit={handleSecurityQuestion} className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">Please answer your security question to continue.</div>
                    <div>
                      <Label>Security Question</Label>
                      <div className="p-3 bg-gray-100 rounded-md text-sm">{selectedAdmin?.securityQuestion}</div>
                    </div>
                    <div>
                      <Label htmlFor="security-answer">Your Answer</Label>
                      <Input
                        id="security-answer"
                        type="text"
                        value={recoveryForm.securityAnswer}
                        onChange={(e) => setRecoveryForm({ ...recoveryForm, securityAnswer: e.target.value })}
                        placeholder="Enter your answer"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800">
                      Verify Answer
                    </Button>
                  </form>
                )}

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setCurrentView("login")
                      resetRecoveryForm()
                    }}
                    className="text-amber-700 hover:text-amber-800"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Login
                  </Button>
                </div>
              </div>
            )}

            {currentView === "reset-password" && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  Create a new password for your account. Make sure it's at least 8 characters long.
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={recoveryForm.newPassword}
                    onChange={(e) => setRecoveryForm({ ...recoveryForm, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={recoveryForm.confirmPassword}
                    onChange={(e) => setRecoveryForm({ ...recoveryForm, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    required
                    minLength={8}
                  />
                </div>
                <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800">
                  <Key className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-amber-900 text-white p-4">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image
              src={restaurantSettings.logo || "/placeholder.svg"}
              alt="Restaurant Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{restaurantSettings.name}</h1>
              <p className="text-amber-200">
                Admin Dashboard - Welcome, {currentUser?.firstName} {currentUser?.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Image
                src={currentUser?.avatar || "/placeholder.svg?height=32&width=32"}
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm">{currentUser?.role}</span>
            </div>
            <Button variant="outline" onClick={handleLogout} className="text-amber-900 border-amber-200 bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Success/Error Messages */}
      {successMessage && (
        <Alert className="mx-4 mt-4 bg-green-100 border-green-300">
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}
      {errorMessage && (
        <Alert className="mx-4 mt-4 bg-red-100 border-red-300">
          <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-amber-100 mb-8">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="menu" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
              Menu Management
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
              Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
              User Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-900">{menuItems.length}</div>
                  <div className="text-sm text-green-600">
                    {menuItems.filter((item) => item.available).length} available
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {orders.filter((order) => order.status !== "delivered" && order.status !== "cancelled").length}
                  </div>
                  <div className="text-sm text-gray-600">
                    {orders.filter((order) => order.status === "preparing").length} preparing
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {restaurantSettings.currency} {analyticsData.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">+12% from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-700">
                    {users.filter((user) => user.isActive).length}
                  </div>
                  <div className="text-sm text-gray-600">
                    {users.filter((user) => user.role === "admin").length} admins
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders with details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-amber-700">{order.customerName.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium">{order.id}</div>
                            <div className="text-sm text-gray-600">{order.customerName}</div>
                            <div className="text-xs text-gray-500">{order.orderTime}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {restaurantSettings.currency} {order.total.toLocaleString()}
                          </div>
                          <Badge
                            className={
                              order.status === "delivered"
                                ? "bg-green-500"
                                : order.status === "preparing"
                                  ? "bg-yellow-500"
                                  : order.status === "ready"
                                    ? "bg-blue-500"
                                    : order.status === "cancelled"
                                      ? "bg-red-500"
                                      : "bg-gray-500"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Items</CardTitle>
                  <CardDescription>Best selling menu items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {menuItems
                      .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
                      .slice(0, 5)
                      .map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600">{item.category}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {restaurantSettings.currency} {item.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              ⭐ {item.rating} • {item.soldCount || 0} sold
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Menu Management Tab */}
          <TabsContent value="menu">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your restaurant menu items with full editing capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search products by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setIsAddingNew(true)} className="bg-amber-700 hover:bg-amber-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                  <Button variant="outline" onClick={() => exportData("menu")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Menu
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Products ({filteredItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Cost/Profit</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="rounded-md object-cover"
                            />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">{item.prepTime}</div>
                              <div className="flex gap-1 mt-1">
                                {item.popular && <Badge className="bg-orange-500 text-xs">Popular</Badge>}
                                {item.spicy && <Badge className="bg-red-500 text-xs">Spicy</Badge>}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{categories.find((c) => c.id === item.category)?.name}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {restaurantSettings.currency} {item.price.toLocaleString()}
                            </div>
                            {item.happyHourPrice && (
                              <div className="text-sm text-orange-600">
                                Happy: {restaurantSettings.currency} {item.happyHourPrice.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="text-red-600">
                              Cost: {restaurantSettings.currency} {(item.cost || 0).toLocaleString()}
                            </div>
                            <div className="text-green-600">
                              Profit: {restaurantSettings.currency} {(item.price - (item.cost || 0)).toLocaleString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{item.soldCount || 0} sold</div>
                            <div className="text-muted-foreground">⭐ {item.rating}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch checked={item.available} onCheckedChange={() => toggleAvailability(item.id)} />
                            <span className="text-sm">{item.available ? "Available" : "Unavailable"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => duplicateItem(item)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Manage customer orders with complete editing capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <Select value={orderFilter} onValueChange={setOrderFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => exportData("orders")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Orders
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orders ({filteredOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Details</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.id}</div>
                            <div className="text-sm text-muted-foreground">{order.orderTime}</div>
                            <Badge variant={order.orderType === "dinein" ? "default" : "secondary"}>
                              {order.orderType === "dinein" ? "Dine In" : "Takeout"}
                            </Badge>
                            {order.tableNumber && (
                              <div className="text-xs text-muted-foreground">Table: {order.tableNumber}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                            {order.customerEmail && (
                              <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                            )}
                            {order.customerAddress && (
                              <div className="text-xs text-muted-foreground">{order.customerAddress}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between">
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                                <span>
                                  {restaurantSettings.currency} {(item.price * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            ))}
                            <div className="font-medium mt-1 pt-1 border-t">
                              Total: {restaurantSettings.currency} {order.total.toLocaleString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{order.paymentMethod || "Not specified"}</div>
                            <Badge className={order.paymentStatus === "Paid" ? "bg-green-500" : "bg-yellow-500"}>
                              {order.paymentStatus || "Pending"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="ready">Ready</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          {order.estimatedTime && (
                            <div className="text-xs text-muted-foreground mt-1">ETA: {order.estimatedTime}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm" onClick={() => handleEditOrder(order)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => duplicateOrder(order)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage admin users with complete profile editing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Manage user accounts, roles, and permissions</div>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsAddingUser(true)} className="bg-amber-700 hover:bg-amber-800">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                    <Button variant="outline" onClick={() => exportData("users")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Users
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Users ({users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Role & Permissions</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.username}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Image
                              src={user.avatar || "/placeholder.svg?height=40&width=40"}
                              alt={`${user.firstName} ${user.lastName}`}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">@{user.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{user.email}</div>
                            <div className="text-muted-foreground">{user.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge
                              variant={
                                user.role === "admin" ? "default" : user.role === "manager" ? "secondary" : "outline"
                              }
                            >
                              {user.role}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {user.permissions?.length || 0} permissions
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {user.lastLogin ? (
                              <div>
                                <div>{user.lastLogin.split(" ")[0]}</div>
                                <div className="text-muted-foreground">{user.lastLogin.split(" ")[1]}</div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Never</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={user.isActive}
                              onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.value })}
                              disabled={editingUser.username === currentUser?.username}
                            />
                            <span className="text-sm">{user.isActive ? "Active" : "Inactive"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user.username)}
                              className="text-red-600 hover:text-red-700"
                              disabled={user.username === currentUser?.username}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-900">
                    {restaurantSettings.currency} {analyticsData.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">+12% from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-900">{analyticsData.totalOrders}</div>
                  <div className="text-sm text-green-600">+8% from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-900">
                    {restaurantSettings.currency} {analyticsData.avgOrderValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">+5% from last month</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Daily revenue for the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {analyticsData.revenueByDay.map((day, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div
                          className="bg-amber-500 rounded-t"
                          style={{
                            height: `${(day.revenue / Math.max(...analyticsData.revenueByDay.map((d) => d.revenue))) * 200}px`,
                            width: "40px",
                          }}
                        />
                        <div className="text-xs text-center">
                          <div className="font-medium">
                            {restaurantSettings.currency} {(day.revenue / 1000).toFixed(0)}K
                          </div>
                          <div className="text-muted-foreground">{day.date.split("-")[2]}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>Sales by menu category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category) => {
                      const categoryItems = menuItems.filter((item) => item.category === category.id)
                      const totalSold = categoryItems.reduce((sum, item) => sum + (item.soldCount || 0), 0)
                      const maxSold = Math.max(
                        ...categories.map((cat) =>
                          menuItems
                            .filter((item) => item.category === cat.id)
                            .reduce((sum, item) => sum + (item.soldCount || 0), 0),
                        ),
                      )

                      return (
                        <div key={category.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{category.name}</span>
                            <span className="text-sm text-muted-foreground">{totalSold} sold</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-amber-600 h-2 rounded-full"
                              style={{ width: `${maxSold > 0 ? (totalSold / maxSold) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* Restaurant Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Restaurant Information</CardTitle>
                  <CardDescription>Basic restaurant details and branding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="restaurant-name">Restaurant Name</Label>
                      <Input
                        id="restaurant-name"
                        value={restaurantSettings.name}
                        onChange={(e) => setRestaurantSettings({ ...restaurantSettings, name: e.target.value })}
                        disabled={!editingSettings}
                      />
                    </div>
                    <div>
                      <Label htmlFor="restaurant-email">Email</Label>
                      <Input
                        id="restaurant-email"
                        type="email"
                        value={restaurantSettings.email}
                        onChange={(e) => setRestaurantSettings({ ...restaurantSettings, email: e.target.value })}
                        disabled={!editingSettings}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="restaurant-description">Description</Label>
                    <Textarea
                      id="restaurant-description"
                      value={restaurantSettings.description}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, description: e.target.value })}
                      disabled={!editingSettings}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="restaurant-phone">Phone</Label>
                      <Input
                        id="restaurant-phone"
                        value={restaurantSettings.phone}
                        onChange={(e) => setRestaurantSettings({ ...restaurantSettings, phone: e.target.value })}
                        disabled={!editingSettings}
                      />
                    </div>
                    <div>
                      <Label htmlFor="restaurant-website">Website</Label>
                      <Input
                        id="restaurant-website"
                        value={restaurantSettings.website || ""}
                        onChange={(e) => setRestaurantSettings({ ...restaurantSettings, website: e.target.value })}
                        disabled={!editingSettings}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="restaurant-address">Address</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="restaurant-address"
                        value={restaurantSettings.address}
                        onChange={(e) => setRestaurantSettings({ ...restaurantSettings, address: e.target.value })}
                        disabled={!editingSettings}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          const encodedAddress = encodeURIComponent(restaurantSettings.address)
                          window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
                        }}
                        className="flex-shrink-0"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        View on Maps
                      </Button>
                    </div>
                  </div>

                  {/* Logo and Cover Image */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Restaurant Logo</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={restaurantSettings.logo || "/placeholder.svg"}
                            alt="Restaurant Logo"
                            width={60}
                            height={60}
                            className="rounded-md object-cover border"
                          />
                          {editingSettings && (
                            <div className="space-y-2">
                              <Input
                                placeholder="Logo URL"
                                value={restaurantSettings.logo}
                                onChange={(e) => setRestaurantSettings({ ...restaurantSettings, logo: e.target.value })}
                              />
                              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Logo
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Cover Image</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={restaurantSettings.coverImage || "/placeholder.svg?height=60&width=100"}
                            alt="Cover Image"
                            width={100}
                            height={60}
                            className="rounded-md object-cover border"
                          />
                          {editingSettings && (
                            <div className="space-y-2">
                              <Input
                                placeholder="Cover Image URL"
                                value={restaurantSettings.coverImage || ""}
                                onChange={(e) =>
                                  setRestaurantSettings({ ...restaurantSettings, coverImage: e.target.value })
                                }
                              />
                              <Button variant="outline" size="sm">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Cover
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operating Hours */}
              <Card>
                <CardHeader>
                  <CardTitle>Operating Hours</CardTitle>
                  <CardDescription>Set your restaurant's opening hours for each day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(restaurantSettings.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center space-x-4">
                        <div className="w-24 capitalize font-medium">{day}</div>
                        <Switch
                          checked={!hours.closed}
                          onCheckedChange={(checked) =>
                            setRestaurantSettings({
                              ...restaurantSettings,
                              openingHours: {
                                ...restaurantSettings.openingHours,
                                [day]: { ...hours, closed: !checked },
                              },
                            })
                          }
                          disabled={!editingSettings}
                        />
                        {!hours.closed && (
                          <>
                            <Input
                              type="time"
                              value={hours.open}
                              onChange={(e) =>
                                setRestaurantSettings({
                                  ...restaurantSettings,
                                  openingHours: {
                                    ...restaurantSettings.openingHours,
                                    [day]: { ...hours, open: e.target.value },
                                  },
                                })
                              }
                              disabled={!editingSettings}
                              className="w-32"
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={hours.close}
                              onChange={(e) =>
                                setRestaurantSettings({
                                  ...restaurantSettings,
                                  openingHours: {
                                    ...restaurantSettings.openingHours,
                                    [day]: { ...hours, close: e.target.value },
                                  },
                                })
                              }
                              disabled={!editingSettings}
                              className="w-32"
                            />
                          </>
                        )}
                        {hours.closed && <span className="text-muted-foreground">Closed</span>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Happy Hour Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Happy Hour Settings</CardTitle>
                  <CardDescription>Configure happy hour timing and discounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={restaurantSettings.happyHour.enabled}
                      onCheckedChange={(checked) =>
                        setRestaurantSettings({
                          ...restaurantSettings,
                          happyHour: { ...restaurantSettings.happyHour, enabled: checked },
                        })
                      }
                      disabled={!editingSettings}
                    />
                    <Label>Enable Happy Hour</Label>
                  </div>

                  {restaurantSettings.happyHour.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="happy-hour-start">Start Time</Label>
                        <Input
                          id="happy-hour-start"
                          type="time"
                          value={restaurantSettings.happyHour.start}
                          onChange={(e) =>
                            setRestaurantSettings({
                              ...restaurantSettings,
                              happyHour: { ...restaurantSettings.happyHour, start: e.target.value },
                            })
                          }
                          disabled={!editingSettings}
                        />
                      </div>
                      <div>
                        <Label htmlFor="happy-hour-end">End Time</Label>
                        <Input
                          id="happy-hour-end"
                          type="time"
                          value={restaurantSettings.happyHour.end}
                          onChange={(e) =>
                            setRestaurantSettings({
                              ...restaurantSettings,
                              happyHour: { ...restaurantSettings.happyHour, end: e.target.value },
                            })
                          }
                          disabled={!editingSettings}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delivery & Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery & Pricing Settings</CardTitle>
                  <CardDescription>Configure delivery options and pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={restaurantSettings.delivery.enabled}
                      onCheckedChange={(checked) =>
                        setRestaurantSettings({
                          ...restaurantSettings,
                          delivery: { ...restaurantSettings.delivery, enabled: checked },
                        })
                      }
                      disabled={!editingSettings}
                    />
                    <Label>Enable Delivery</Label>
                  </div>

                  {restaurantSettings.delivery.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="delivery-fee">Delivery Fee ({restaurantSettings.currency})</Label>
                        <Input
                          id="delivery-fee"
                          type="number"
                          value={restaurantSettings.delivery.fee}
                          onChange={(e) =>
                            setRestaurantSettings({
                              ...restaurantSettings,
                              delivery: { ...restaurantSettings.delivery, fee: Number(e.target.value) },
                            })
                          }
                          disabled={!editingSettings}
                        />
                      </div>
                      <div>
                        <Label htmlFor="free-delivery-threshold">
                          Free Delivery Threshold ({restaurantSettings.currency})
                        </Label>
                        <Input
                          id="free-delivery-threshold"
                          type="number"
                          value={restaurantSettings.delivery.freeDeliveryThreshold}
                          onChange={(e) =>
                            setRestaurantSettings({
                              ...restaurantSettings,
                              delivery: {
                                ...restaurantSettings.delivery,
                                freeDeliveryThreshold: Number(e.target.value),
                              },
                            })
                          }
                          disabled={!editingSettings}
                        />
                      </div>
                      <div>
                        <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
                        <Input
                          id="delivery-radius"
                          type="number"
                          value={restaurantSettings.delivery.radius}
                          onChange={(e) =>
                            setRestaurantSettings({
                              ...restaurantSettings,
                              delivery: { ...restaurantSettings.delivery, radius: Number(e.target.value) },
                            })
                          }
                          disabled={!editingSettings}
                        />
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                      <Input
                        id="tax-rate"
                        type="number"
                        value={restaurantSettings.tax.rate}
                        onChange={(e) =>
                          setRestaurantSettings({
                            ...restaurantSettings,
                            tax: { ...restaurantSettings.tax, rate: Number(e.target.value) },
                          })
                        }
                        disabled={!editingSettings}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        checked={restaurantSettings.tax.included}
                        onCheckedChange={(checked) =>
                          setRestaurantSettings({
                            ...restaurantSettings,
                            tax: { ...restaurantSettings.tax, included: checked },
                          })
                        }
                        disabled={!editingSettings}
                      />
                      <Label>Tax Included in Prices</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Links</CardTitle>
                  <CardDescription>Connect your social media accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={restaurantSettings.socialMedia.facebook || ""}
                        onChange={(e) =>
                          setRestaurantSettings({
                            ...restaurantSettings,
                            socialMedia: { ...restaurantSettings.socialMedia, facebook: e.target.value },
                          })
                        }
                        disabled={!editingSettings}
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={restaurantSettings.socialMedia.instagram || ""}
                        onChange={(e) =>
                          setRestaurantSettings({
                            ...restaurantSettings,
                            socialMedia: { ...restaurantSettings.socialMedia, instagram: e.target.value },
                          })
                        }
                        disabled={!editingSettings}
                        placeholder="https://instagram.com/yourpage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={restaurantSettings.socialMedia.twitter || ""}
                        onChange={(e) =>
                          setRestaurantSettings({
                            ...restaurantSettings,
                            socialMedia: { ...restaurantSettings.socialMedia, twitter: e.target.value },
                          })
                        }
                        disabled={!editingSettings}
                        placeholder="https://twitter.com/yourpage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={restaurantSettings.socialMedia.whatsapp || ""}
                        onChange={(e) =>
                          setRestaurantSettings({
                            ...restaurantSettings,
                            socialMedia: { ...restaurantSettings.socialMedia, whatsapp: e.target.value },
                          })
                        }
                        disabled={!editingSettings}
                        placeholder="+250123456789"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Settings Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => exportData("settings")}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Settings
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {editingSettings ? (
                        <>
                          <Button variant="outline" onClick={() => setEditingSettings(false)}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateSettings} className="bg-amber-700 hover:bg-amber-800">
                            <Save className="h-4 w-4 mr-2" />
                            Save Settings
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setEditingSettings(true)} className="bg-amber-700 hover:bg-amber-800">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Settings
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            handleImageUpload(file, (url) => {
              if (editingItem) {
                setEditingItem({ ...editingItem, image: url })
              } else if (isAddingNew) {
                setNewItem({ ...newItem, image: url })
              }
            })
          }
        }}
      />

      {/* Add New Product Dialog */}
      <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Create a new menu item with complete details and image</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Image Section */}
            <div className="space-y-4">
              <Label>Product Image</Label>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Image
                    src={imagePreview || newItem.image || "/placeholder.svg?height=150&width=200"}
                    alt="Product Preview"
                    width={200}
                    height={150}
                    className="rounded-md object-cover border"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Image URL"
                    value={newItem.image}
                    onChange={(e) => {
                      setNewItem({ ...newItem, image: e.target.value })
                      handleImageUrlChange(e.target.value, setImagePreview)
                    }}
                  />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setNewItem({ ...newItem, image: "/placeholder.svg?height=200&width=300" })
                        setImagePreview(null)
                      }}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Use Placeholder
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Enter detailed product description"
                rows={3}
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="price">Price ({restaurantSettings.currency}) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="happyHourPrice">Happy Hour Price ({restaurantSettings.currency})</Label>
                <Input
                  id="happyHourPrice"
                  type="number"
                  value={newItem.happyHourPrice}
                  onChange={(e) => setNewItem({ ...newItem, happyHourPrice: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="cost">Cost ({restaurantSettings.currency})</Label>
                <Input
                  id="cost"
                  type="number"
                  value={newItem.cost}
                  onChange={(e) => setNewItem({ ...newItem, cost: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  value={newItem.calories}
                  onChange={(e) => setNewItem({ ...newItem, calories: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prepTime">Preparation Time *</Label>
                <Input
                  id="prepTime"
                  value={newItem.prepTime}
                  onChange={(e) => setNewItem({ ...newItem, prepTime: e.target.value })}
                  placeholder="e.g., 10-15 min"
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={newItem.rating}
                  onChange={(e) => setNewItem({ ...newItem, rating: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Ingredients and Allergens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
                <Textarea
                  id="ingredients"
                  value={newItem.ingredients?.join(", ") || ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      ingredients: e.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter((item) => item),
                    })
                  }
                  placeholder="Beef, Cheese, Lettuce, Tomato"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="allergens">Allergens (comma separated)</Label>
                <Textarea
                  id="allergens"
                  value={newItem.allergens?.join(", ") || ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      allergens: e.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter((item) => item),
                    })
                  }
                  placeholder="Gluten, Dairy, Nuts"
                  rows={2}
                />
              </div>
            </div>

            {/* Flags */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newItem.popular}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, popular: checked })}
                />
                <Label>Popular Item</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newItem.spicy}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, spicy: checked })}
                />
                <Label>Spicy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newItem.available}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, available: checked })}
                />
                <Label>Available</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingNew(false)
                setImagePreview(null)
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleAddItem} className="bg-amber-700 hover:bg-amber-800">
              <Save className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={!!editingItem}
        onOpenChange={() => {
          setEditingItem(null)
          setImagePreview(null)
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update all product details including images</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-6 py-4">
              {/* Image Section */}
              <div className="space-y-4">
                <Label>Product Image</Label>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={imagePreview || editingItem.image}
                      alt="Product Preview"
                      width={200}
                      height={150}
                      className="rounded-md object-cover border"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Image URL"
                      value={editingItem.image}
                      onChange={(e) => {
                        setEditingItem({ ...editingItem, image: e.target.value })
                        handleImageUrlChange(e.target.value, setImagePreview)
                      }}
                    />
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Image
                      </Button>
                      <Button type="button" variant="outline" onClick={() => window.open(editingItem.image, "_blank")}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Current
                      </Button>
                    </div>
                  </div>
                </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Product Name *</Label>
                  <Input
                    id="edit-name"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select
                    value={editingItem.category}
                    onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="edit-price">Price ({restaurantSettings.currency}) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-happyHourPrice">Happy Hour Price ({restaurantSettings.currency})</Label>
                  <Input
                    id="edit-happyHourPrice"
                    type="number"
                    value={editingItem.happyHourPrice || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, happyHourPrice: Number(e.target.value) || undefined })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-cost">Cost ({restaurantSettings.currency})</Label>
                  <Input
                    id="edit-cost"
                    type="number"
                    value={editingItem.cost || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, cost: Number(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-calories">Calories</Label>
                  <Input
                    id="edit-calories"
                    type="number"
                    value={editingItem.calories || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, calories: Number(e.target.value) || undefined })}
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-prepTime">Preparation Time *</Label>
                  <Input
                    id="edit-prepTime"
                    value={editingItem.prepTime}
                    onChange={(e) => setEditingItem({ ...editingItem, prepTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-rating">Rating (1-5)</Label>
                  <Input
                    id="edit-rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={editingItem.rating}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Ingredients and Allergens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-ingredients">Ingredients (comma separated)</Label>
                  <Textarea
                    id="edit-ingredients"
                    value={editingItem.ingredients?.join(", ") || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        ingredients: e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter((item) => item),
                      })
                    }
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-allergens">Allergens (comma separated)</Label>
                  <Textarea
                    id="edit-allergens"
                    value={editingItem.allergens?.join(", ") || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        allergens: e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter((item) => item),
                      })
                    }
                    rows={2}
                  />
                </div>
              </div>

              {/* Sales Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-soldCount">Items Sold</Label>
                  <Input
                    id="edit-soldCount"
                    type="number"
                    value={editingItem.soldCount || 0}
                    onChange={(e) => setEditingItem({ ...editingItem, soldCount: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-lastOrdered">Last Ordered</Label>
                  <Input
                    id="edit-lastOrdered"
                    type="date"
                    value={editingItem.lastOrdered || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, lastOrdered: e.target.value })}
                  />
                </div>
              </div>

              {/* Flags */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingItem.popular}
                    onCheckedChange={(checked) => setEditingItem({ ...editingItem, popular: checked })}
                  />
                  <Label>Popular Item</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingItem.spicy}
                    onCheckedChange={(checked) => setEditingItem({ ...editingItem, spicy: checked })}
                  />
                  <Label>Spicy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingItem.available}
                    onCheckedChange={(checked) => setEditingItem({ ...editingItem, available: checked })}
                  />
                  <Label>Available</Label>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm text-muted-foreground">Created</Label>
                  <div className="text-sm">{editingItem.createdAt || "Unknown"}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Last Updated</Label>
                  <div className="text-sm">{editingItem.updatedAt || "Unknown"}</div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditingItem(null)
                setImagePreview(null)
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleUpdateItem} className="bg-amber-700 hover:bg-amber-800">
              <Save className="h-4 w-4 mr-2" />
              Update Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>Update complete order details and customer information</DialogDescription>
          </DialogHeader>
          {editingOrder && (
            <div className="grid gap-6 py-4">
              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-order-id">Order ID</Label>
                  <Input
                    id="edit-order-id"
                    value={editingOrder.id}
                    onChange={(e) => setEditingOrder({ ...editingOrder, id: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-order-type">Order Type</Label>
                  <Select
                    value={editingOrder.orderType}
                    onValueChange={(value) =>
                      setEditingOrder({ ...editingOrder, orderType: value as "takeout" | "dinein" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinein">Dine In</SelectItem>
                      <SelectItem value="takeout">Takeout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Customer Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-customer-name">Customer Name</Label>
                    <Input
                      id="edit-customer-name"
                      value={editingOrder.customerName}
                      onChange={(e) => setEditingOrder({ ...editingOrder, customerName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-customer-phone">Customer Phone</Label>
                    <Input
                      id="edit-customer-phone"
                      value={editingOrder.customerPhone}
                      onChange={(e) => setEditingOrder({ ...editingOrder, customerPhone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-customer-email">Customer Email</Label>
                    <Input
                      id="edit-customer-email"
                      type="email"
                      value={editingOrder.customerEmail || ""}
                      onChange={(e) => setEditingOrder({ ...editingOrder, customerEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-customer-address">Customer Address</Label>
                    <Input
                      id="edit-customer-address"
                      value={editingOrder.customerAddress || ""}
                      onChange={(e) => setEditingOrder({ ...editingOrder, customerAddress: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Order Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-order-time">Order Time</Label>
                    <Input
                      id="edit-order-time"
                      value={editingOrder.orderTime}
                      onChange={(e) => setEditingOrder({ ...editingOrder, orderTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-estimated-time">Estimated Time</Label>
                    <Input
                      id="edit-estimated-time"
                      value={editingOrder.estimatedTime || ""}
                      onChange={(e) => setEditingOrder({ ...editingOrder, estimatedTime: e.target.value })}
                      placeholder="e.g., 15 min"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-delivery-time">Delivery Time</Label>
                    <Input
                      id="edit-delivery-time"
                      value={editingOrder.deliveryTime || ""}
                      onChange={(e) => setEditingOrder({ ...editingOrder, deliveryTime: e.target.value })}
                    />
                  </div>
                </div>

                {editingOrder.orderType === "dinein" && (
                  <div>
                    <Label htmlFor="edit-table-number">Table Number</Label>
                    <Input
                      id="edit-table-number"
                      value={editingOrder.tableNumber || ""}
                      onChange={(e) => setEditingOrder({ ...editingOrder, tableNumber: e.target.value })}
                      placeholder="e.g., T-05"
                    />
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Payment Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-payment-method">Payment Method</Label>
                    <Select
                      value={editingOrder.paymentMethod || ""}
                      onValueChange={(value) => setEditingOrder({ ...editingOrder, paymentMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-payment-status">Payment Status</Label>
                    <Select
                      value={editingOrder.paymentStatus || ""}
                      onValueChange={(value) => setEditingOrder({ ...editingOrder, paymentStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-total">Total ({restaurantSettings.currency})</Label>
                    <Input
                      id="edit-total"
                      type="number"
                      value={editingOrder.total}
                      onChange={(e) => setEditingOrder({ ...editingOrder, total: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Order Items</Label>
                <div className="space-y-2">
                  {editingOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <div className="flex-1">
                        <Input
                          value={item.name}
                          onChange={(e) => {
                            const updatedItems = [...editingOrder.items]
                            updatedItems[index] = { ...item, name: e.target.value }
                            setEditingOrder({ ...editingOrder, items: updatedItems })
                          }}
                          placeholder="Item name"
                        />
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const updatedItems = [...editingOrder.items]
                            updatedItems[index] = { ...item, quantity: Number(e.target.value) }
                            setEditingOrder({ ...editingOrder, items: updatedItems })
                          }}
                          placeholder="Qty"
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const updatedItems = [...editingOrder.items]
                            updatedItems[index] = { ...item, price: Number(e.target.value) }
                            setEditingOrder({ ...editingOrder, items: updatedItems })
                          }}
                          placeholder="Price"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updatedItems = editingOrder.items.filter((_, i) => i !== index)
                          setEditingOrder({ ...editingOrder, items: updatedItems })
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newItem = { id: generateId(), name: "", quantity: 1, price: 0 }
                      setEditingOrder({ ...editingOrder, items: [...editingOrder.items, newItem] })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="edit-order-notes">Order Notes</Label>
                <Textarea
                  id="edit-order-notes"
                  value={editingOrder.notes || ""}
                  onChange={(e) => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                  placeholder="Special instructions or notes"
                  rows={3}
                />
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm text-muted-foreground">Created</Label>
                  <div className="text-sm">{editingOrder.createdAt || "Unknown"}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Last Updated</Label>
                  <div className="text-sm">{editingOrder.updatedAt || "Unknown"}</div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingOrder(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleUpdateOrder} className="bg-amber-700 hover:bg-amber-800">
              <Save className="h-4 w-4 mr-2" />
              Update Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new admin user account with complete profile</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Avatar */}
            <div className="space-y-4">
              <Label>User Avatar</Label>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Image
                    src={newUser.avatar || "/placeholder.svg?height=100&width=100"}
                    alt="User Avatar"
                    width={100}
                    height={100}
                    className="rounded-full object-cover border"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Avatar URL"
                    value={newUser.avatar || ""}
                    onChange={(e) => setNewUser({ ...newUser, avatar: e.target.value })}
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Avatar
                  </Button>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-username">Username *</Label>
                <Input
                  id="new-username"
                  value={newUser.username || ""}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="new-password">Password *</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newUser.password || ""}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <Label htmlFor="new-email">Email *</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUser.email || ""}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="new-phone">Phone</Label>
                <Input
                  id="new-phone"
                  value={newUser.phone || ""}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-first-name">First Name</Label>
                <Input
                  id="new-first-name"
                  value={newUser.firstName || ""}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="new-last-name">Last Name</Label>
                <Input
                  id="new-last-name"
                  value={newUser.lastName || ""}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Security */}
            <div className="space-y-2">
              <Label htmlFor="new-security-question">Security Question *</Label>
              <Input
                id="new-security-question"
                value={newUser.securityQuestion || ""}
                onChange={(e) => setNewUser({ ...newUser, securityQuestion: e.target.value })}
                placeholder="Enter security question"
              />
              <Label htmlFor="new-security-answer">Security Answer *</Label>
              <Input
                id="new-security-answer"
                value={newUser.securityAnswer || ""}
                onChange={(e) => setNewUser({ ...newUser, securityAnswer: e.target.value })}
                placeholder="Enter security answer"
              />
            </div>

            {/* Role and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-role">Role</Label>
                <Select
                  value={newUser.role || "staff"}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "manager" | "staff" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  checked={newUser.isActive || true}
                  onChange={(e) => setNewUser({ ...newUser, isActive: e.target.value })}
                />
                <Label>Active</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddingUser(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleAddUser} className="bg-amber-700 hover:bg-amber-800">
              <Save className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update complete user profile and permissions</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-6 py-4">
              {/* Avatar */}
              <div className="space-y-4">
                <Label>User Avatar</Label>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={editingUser.avatar || "/placeholder.svg?height=100&width=100"}
                      alt="User Avatar"
                      width={100}
                      height={100}
                      className="rounded-full object-cover border"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Avatar URL"
                      value={editingUser.avatar || ""}
                      onChange={(e) => setEditingUser({ ...editingUser, avatar: e.target.value })}
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Avatar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-username">Username</Label>
                  <Input id="edit-username" value={editingUser.username} disabled />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-first-name">First Name</Label>
                  <Input
                    id="edit-first-name"
                    value={editingUser.firstName || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-last-name">Last Name</Label>
                  <Input
                    id="edit-last-name"
                    value={editingUser.lastName || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              {/* Security */}
              <div className="space-y-2">
                <Label htmlFor="edit-security-question">Security Question</Label>
                <Input
                  id="edit-security-question"
                  value={editingUser.securityQuestion}
                  onChange={(e) => setEditingUser({ ...editingUser, securityQuestion: e.target.value })}
                  placeholder="Enter security question"
                />
                <Label htmlFor="edit-security-answer">Security Answer</Label>
                <Input
                  id="edit-security-answer"
                  value={editingUser.securityAnswer}
                  onChange={(e) => setEditingUser({ ...editingUser, securityAnswer: e.target.value })}
                  placeholder="Enter security answer"
                />
              </div>

              {/* Role and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value as "admin" | "manager" | "staff" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={editingUser.isActive}
                    onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.value })}
                    disabled={editingUser.username === currentUser?.username}
                  />
                  <Label>Active</Label>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} className="bg-amber-700 hover:bg-amber-800">
              <Save className="h-4 w-4 mr-2" />
              Update User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )\
}
