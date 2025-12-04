export default function StoreLocator() {
  return (
    <section className="container py-12">
      <h2 className="text-2xl font-bold mb-4">Store Locator</h2>
      <iframe
        title="Store Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14015.824!2d77.2090!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sConnaught%20Place!5e0!3m2!1sen!2sin!4v1681731600000"
        width="100%" height="420" style={{border:0}} allowFullScreen="" loading="lazy"
      ></iframe>
    </section>
  );
}
