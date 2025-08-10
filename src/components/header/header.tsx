function Header() {
  return (
    <header className="w-full h-16 shadow-lg  items-center justify-center bg-card">
      <div className="w-full h-full py-4 px-2">
        <svg className="h-full w-16">
          <use href="/mag7Logo.svg" className="fill-foreground" />
        </svg>
      </div>
    </header>
  );
}

export default Header;
