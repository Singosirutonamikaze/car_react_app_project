# Structure

siruto@singolatitude5510:~/Documents/CodesDocs/react_web/NextJS-CAR/Frontend/react-client-frontend$ tree -I node_modules/
.
├── dist
│   ├── assets
│   │   ├── hero-cxDL-i1y.png
│   │   ├── index-BVmyOcJj.css
│   │   └── index-C9vgUgSh.js
│   ├── index.html
│   ├── logo.png
│   └── vite.svg
├── eslint.config.js
├── index.html
├── package.json
├── public
│   ├── logo.png
│   └── vite.svg
├── README.md
├── src
│   ├── app
│   │   ├── auth
│   │   │   ├── components
│   │   │   │   ├── form
│   │   │   │   │   ├── ConnexionForm.tsx
│   │   │   │   │   └── InscriptionForm.tsx
│   │   │   │   └── inputs
│   │   │   │       └── Input.tsx
│   │   │   └── pages
│   │   │       ├── ConnexionPage.tsx
│   │   │       └── InscriptionPage.tsx
│   │   ├── client-dashboard
│   │   │   ├── components
│   │   │   │   ├── cart
│   │   │   │   ├── dashboard
│   │   │   │   │   └── Card.tsx
│   │   │   │   ├── favorites
│   │   │   │   ├── orders
│   │   │   │   └── profile
│   │   │   └── pages
│   │   │       ├── CommandesPage.tsx
│   │   │       ├── DashboardPage.tsx
│   │   │       ├── FavorisPage.tsx
│   │   │       ├── PanierPage.tsx
│   │   │       ├── ParametresPage.tsx
│   │   │       └── ProfilPage.tsx
│   │   ├── common
│   │   │   ├── LoaderPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   └── presentation
│   │       ├── components
│   │       │   ├── car
│   │       │   │   ├── CardSearchStyle.tsx
│   │       │   │   └── CardStyle.tsx
│   │       │   ├── forms
│   │       │   │   └── ContactForm.tsx
│   │       │   └── sections
│   │       │       ├── AProposHeroSection.tsx
│   │       │       ├── AProposSection.tsx
│   │       │       ├── ContactInfo.tsx
│   │       │       ├── ContactSection.tsx
│   │       │       ├── CTASection.tsx
│   │       │       ├── FAQSection.tsx
│   │       │       ├── FeaturesSection.tsx
│   │       │       ├── HeroContent.tsx
│   │       │       ├── HeroImage.tsx
│   │       │       ├── HeroSection.tsx
│   │       │       ├── HistorySection.tsx
│   │       │       ├── LocationCard.tsx
│   │       │       ├── PaymentSection.tsx
│   │       │       ├── ServicesSection.tsx
│   │       │       ├── VoituresListSection.tsx
│   │       │       └── VoituresRechercheSection.tsx
│   │       └── pages
│   │           ├── AccueilPage.tsx
│   │           ├── AProposPage.tsx
│   │           ├── CarDetailsPage.tsx
│   │           ├── ContactPage.tsx
│   │           ├── RecherchePage.tsx
│   │           └── VoituresPage.tsx
│   ├── App.tsx
│   ├── assets
│   │   ├── animations
│   │   ├── fonts
│   │   ├── images
│   │   │   ├── cars
│   │   │   │   └── hero.png
│   │   │   ├── icons
│   │   │   └── logos
│   │   └── react.svg
│   ├── index.css
│   ├── main.tsx
│   ├── router.tsx
│   ├── shared
│   │   ├── components
│   │   │   ├── layouts
│   │   │   │   ├── AuthLayout.tsx
│   │   │   │   ├── ClientLayout.tsx
│   │   │   │   └── PresentationLayout.tsx
│   │   │   └── ui
│   │   │       ├── Badge.tsx
│   │   │       ├── Loading.tsx
│   │   │       ├── navbars
│   │   │       │   ├── NavBarDashboard.tsx
│   │   │       │   └── NavBarPresentation.tsx
│   │   │       └── SideBar.tsx
│   │   ├── contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── UserProvider.tsx
│   │   ├── hooks
│   │   │   ├── useAuth.ts
│   │   │   └── useUser.ts
│   │   ├── services
│   │   │   ├── authService.ts
│   │   │   ├── carService.ts
│   │   │   ├── clientService.ts
│   │   │   ├── dashboardService.ts
│   │   │   ├── orderService.ts
│   │   │   └── uploadService.ts
│   │   ├── types
│   │   │   ├── auth.ts
│   │   │   ├── car.ts
│   │   │   ├── client.ts
│   │   │   ├── dashboard.ts
│   │   │   └── order.ts
│   │   └── utils
│   │       ├── constants.ts
│   │       ├── data.ts
│   │       ├── formatters.ts
│   │       ├── helpers.ts
│   │       ├── localStorage.ts
│   │       └── validation.ts
│   ├── styles
│   │   └── globals.css
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── yarn.lock

44 directories, 93 files
siruto@singolatitude5510:~/Documents/CodesDocs/react_web/NextJS-CAR/Frontend/react-client-frontend$

siruto@singolatitude5510:~/Documents/CodesDocs/react_web/NextJS-CAR/Frontend/react-app-admin-car$ tree -I node_modules/
.
├── context
│   ├── userContext.jsx
│   └── UserProvider.jsx
├── dist
│   ├── assets
│   │   ├── admin-BUlp69w7.avif
│   │   ├── hero-DsGNy03t.png
│   │   ├── index-BC2UQTxR.css
│   │   ├── index-BO338cS9.js
│   │   └── logo-BDbWSDqh.png
│   ├── index.html
│   └── logo.png
├── eslint.config.js
├── hooks
│   └── UserAuthentification.jsx
├── index.html
├── package.json
├── package-lock.json
├── public
│   └── logo.png
├── README.md
├── service
│   └── axiosInstance.ts
├── src
│   ├── App.jsx
│   ├── assets
│   │   ├── admin.avif
│   │   ├── arrow-down.svg
│   │   ├── car-logo.svg
│   │   ├── chevron-up-down.svg
│   │   ├── close.svg
│   │   ├── discord.svg
│   │   ├── facebook.svg
│   │   ├── FortFielda.webp
│   │   ├── gas.svg
│   │   ├── github.svg
│   │   ├── heart-filled.svg
│   │   ├── heart-outline.svg
│   │   ├── hero-bg.png
│   │   ├── hero.png
│   │   ├── linkedin.svg
│   │   ├── logo.svg
│   │   ├── magnifying-glass.svg
│   │   ├── model-icon.png
│   │   ├── next.svg
│   │   ├── pattern.png
│   │   ├── Renaults.jpeg
│   │   ├── right-arrow.svg
│   │   ├── steering-wheel.svg
│   │   ├── tire.svg
│   │   ├── Totyota.png
│   │   ├── twitter.svg
│   │   ├── vercel.svg
│   │   └── Volkswagen-Golf-2024-hd.jpg
│   ├── auth
│   │   └── Login.jsx
│   ├── components
│   │   ├── alerts
│   │   │   └── DeleteAlert.jsx
│   │   ├── buttons
│   │   ├── cards
│   │   │   ├── CardAvatar.jsx
│   │   │   ├── CarInfoCard.jsx
│   │   │   ├── ClientInfoCard.jsx
│   │   │   ├── CommandInfoCard.jsx
│   │   │   ├── DashboardOverviewStats.jsx
│   │   │   ├── InfoCardForm.jsx
│   │   │   ├── InformationCardStats.jsx
│   │   │   ├── SaleInfoCard.jsx
│   │   │   └── StatsCardOverview.jsx
│   │   ├── Cars
│   │   │   ├── AddCarsForm.jsx
│   │   │   ├── CarsList.jsx
│   │   │   └── EditCarsForm.jsx
│   │   ├── charts
│   │   │   ├── CarsChartsBar.jsx
│   │   │   ├── CommandsCharts.jsx
│   │   │   ├── CustomBarChart.jsx
│   │   │   ├── CustomBarChartOrders.jsx
│   │   │   ├── CustomBarChartSales.jsx
│   │   │   ├── CustomCarChart.jsx
│   │   │   ├── CustomLegend.jsx
│   │   │   ├── CustomLineChart.jsx
│   │   │   ├── CustomPieChart.jsx
│   │   │   ├── CustomTooltip.jsx
│   │   │   └── SalesCharts.jsx
│   │   ├── Clients
│   │   │   ├── AddClientsForm.jsx
│   │   │   ├── ClientsList.jsx
│   │   │   ├── ClientsOverview.jsx
│   │   │   └── EditClientsForm.jsx
│   │   ├── Commands
│   │   │   ├── AddCommandsForm.jsx
│   │   │   ├── CommandsList.jsx
│   │   │   └── EditCommandsForm.jsx
│   │   ├── Dashboard
│   │   │   └── LastCommandesChart.jsx
│   │   ├── forms
│   │   ├── inputs
│   │   │   ├── Input.jsx
│   │   │   └── Select.jsx
│   │   ├── layouts
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── NavBar.jsx
│   │   │   └── SideBar.jsx
│   │   ├── models
│   │   │   ├── EmojiPickerPopup.jsx
│   │   │   ├── Model.jsx
│   │   │   └── ProfileModel.jsx
│   │   └── Sales
│   │       ├── AddSalesForm.jsx
│   │       ├── EditSalesForm.jsx
│   │       └── SalesList.jsx
│   ├── index.css
│   ├── main.jsx
│   └── pages
│       ├── CarsPage.jsx
│       ├── ClientsPage.jsx
│       ├── CommandsPage.jsx
│       ├── DashboardPage.jsx
│       ├── Rout.jsx
│       └── SalesPage.jsx
├── utils
│   ├── apiPath.ts
│   ├── data.ts
│   ├── helper.ts
│   └── uploadImage.ts
└── vite.config.js

26 directories, 104 files
siruto@singolatitude5510:~/Documents/CodesDocs/react_web/NextJS-CAR/Frontend/react-app-admin-car$

siruto@singolatitude5510:~/Documents/CodesDocs/react_web/NextJS-CAR/Backend$ tree -I node_modules/
.
├── dist
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── adminControllers.js
│   │   ├── authController.js
│   │   ├── carsController.js
│   │   ├── clients.controller.js
│   │   ├── commandsController.js
│   │   ├── dashboardController.js
│   │   └── ventesController.js
│   ├── index.js
│   ├── interfaces
│   │   ├── ICar.js
│   │   ├── ICommande.js
│   │   ├── IUser.js
│   │   └── IVente.js
│   ├── middleware
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── loggingMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models
│   │   ├── Admin.js
│   │   ├── Car.js
│   │   ├── Client.js
│   │   ├── Commande.js
│   │   └── Vente.js
│   ├── routes
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── cars.routes.js
│   │   ├── clients.routes.js
│   │   ├── commands.routes.js
│   │   ├── dashboard.routes.js
│   │   └── ventes.routes.js
│   ├── scripts
│   │   └── initAdmin.js
│   ├── server.js
│   └── utils
│       └── generateToken.js
├── package.json
├── package-lock.json
├── src
│   ├── config
│   │   └── db.ts
│   ├── controllers
│   │   ├── achatControllers.ts
│   │   ├── adminControllers.ts
│   │   ├── authController.ts
│   │   ├── carsController.ts
│   │   ├── clients.controller.ts
│   │   ├── commandsController.ts
│   │   ├── dashboardController.ts
│   │   ├── favoritesControllers.ts
│   │   └── ventesController.ts
│   ├── index.ts
│   ├── interfaces
│   │   ├── IAchat.ts
│   │   ├── ICar.ts
│   │   ├── ICommande.ts
│   │   ├── IFavorite.ts
│   │   ├── IUser.ts
│   │   └── IVente.ts
│   ├── middleware
│   │   ├── adminMiddleware.ts
│   │   ├── authMiddleware.ts
│   │   ├── errorMiddleware.ts
│   │   ├── loggingMiddleware.ts
│   │   └── uploadMiddleware.ts
│   ├── models
│   │   ├── Achat.ts
│   │   ├── Admin.ts
│   │   ├── Car.ts
│   │   ├── Client.ts
│   │   ├── Commande.ts
│   │   ├── Favorites.ts
│   │   └── Vente.ts
│   ├── routes
│   │   ├── achat.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── cars.routes.ts
│   │   ├── clients.routes.ts
│   │   ├── commands.routes.ts
│   │   ├── dashboard.routes.ts
│   │   ├── favorites.routes.ts
│   │   ├── user.routes.ts
│   │   └── ventes.routes.ts
│   ├── scripts
│   │   └── initAdmin.ts
│   ├── server.ts
│   └── utils
│       └── generateToken.ts
├── tsconfig.json
└── uploads

20 directories, 78 files
siruto@singolatitude5510:~/Documents/CodesDocs/react_web/NextJS-CAR/Backend$
