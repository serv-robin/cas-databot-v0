export default function Logo() {
  // This component can be customized with the client's logo
  return (
    <div className="flex items-center gap-2">
      {/* Placeholder logo - replace with client's logo */}
      <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
        B
      </div>
      <span className="font-semibold text-lg">Business Assistant</span>
    </div>
  )
}
