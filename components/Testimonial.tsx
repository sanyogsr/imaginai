// components/Testimonials.js
export default function Testimonials() {
  const testimonials = [
    {
      name: "John Doe",
      feedback:
        "This platform is incredible! It turned my ideas into stunning visuals in no time.",
      role: "CEO, Visual Inc.",
    },
    {
      name: "Jane Smith",
      feedback:
        "The AI-powered tools are beyond impressive. My workflow has never been smoother!",
      role: "Designer, Creative Studio",
    },
    {
      name: "Mark Wilson",
      feedback:
        "The results were instant and absolutely perfect for social sharing. Highly recommend!",
      role: "Influencer, SocialMediaHub",
    },
    {
      name: "Emily Johnson",
      feedback:
        "Such a game-changer for quick visual content creation. Love the platform!",
      role: "Marketing Manager, Adify",
    },
  ];

  return (
    <div className="w-full py-20 bg-gray-50 rounded-lg">
      <h2 className="text-4xl font-bold text-center text-gray-800 font-serif mb-12">
        Testimonials
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-12">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="p-8 bg-white rounded-xl border border-black hover:shadow-2xl transition duration-300"
          >
            <p className="text-lg text-gray-700 italic mb-4">
              {testimonial.feedback}
            </p>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {testimonial.name}
              </h3>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
