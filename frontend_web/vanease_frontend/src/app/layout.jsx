import "../styles/global.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>VanEase - Premium Van Rental Service</title>
        <meta
          name="description"
          content="Rent comfortable and reliable vans for your next adventure or business needs."
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

