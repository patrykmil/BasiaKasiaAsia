import Cards from "@/components/Card";
import Footer from "@/components/Foooter";
import Menu from "@/components/Menu";

function AboutPage() {
    return (
        <div className='w-full min-h-screen flex flex-col gap-4 p-4 bg-gray-50'> 
            <Menu />
            <div className="flex flex-col flex-1 items-center">
                <img src="/src/assets/img/about_us_banner.jpg" alt="About Us Banner" className="w-full max-w-4xl mb-8 rounded-lg shadow-lg" />
                
                <div className="max-w-4xl p-8 rounded-lg shadow-lg mb-8">
                    <p className="text-lg leading-relaxed mb-6">
                        Welcome to our forum — a cozy online space created by three Japanese women: <strong>Basia</strong>, <strong>Kasia</strong>, and <strong>Asia</strong>. We are close friends who share a deep passion for celebrating womanhood in all its beautiful forms. Together, we wanted to build a community where women can openly discuss everyday life, share experiences, and inspire one another.
                    </p>

                    <p className="text-lg leading-relaxed mb-6">
                        On our forum, we explore topics that reflect the heart of a woman's world, including:
                    </p>

                    <ul className="space-y-3 mb-6 ml-6">
                        <li className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></span>
                            <span><strong>Daily life and responsibilities</strong> — balancing roles, managing routines, and finding time for ourselves</span>
                        </li>
                        <li className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></span>
                            <span><strong>Home & cleaning tips</strong> — smarter ways to keep our homes warm and welcoming</span>
                        </li>
                        <li className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></span>
                            <span><strong>Cooking & traditional recipes</strong> — from quick everyday meals to special dishes full of flavor and culture</span>
                        </li>
                        <li className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></span>
                            <span><strong>Fashion & personal style</strong> — expressing femininity, trends, and confidence</span>
                        </li>
                        <li className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></span>
                            <span><strong>Handmade crafts & DIY</strong> — creative projects that bring joy and personal touch to life</span>
                        </li>
                    </ul>

                    <p className="text-lg leading-relaxed mb-6">
                        Our mission is to create a friendly, supportive environment where every woman feels seen, heard, and inspired. Whether you're looking for advice, motivation, or just a place to connect with others who understand your journey — you're in the right place.
                    </p>

                    <p className="text-lg leading-relaxed mb-6">
                        Join us, share your voice, and let's grow together in strength, creativity, and sisterhood.
                    </p>

                    <div className="text-lg">
                        <p className="mb-2">With love,</p>
                        <p className="font-semibold">Basia, Kasia & Asia</p>
                    </div>
                </div>

                <div className="w-full max-w-fit">
                    <p className="text-2xl font-semibold mb-4">Our Founders</p>
                    <div className="flex gap-6 flex-wrap">
                        <Cards 
                            imageSrc="/src/assets/img/Basia.jpg"
                            title="Basia"
                            description="Co-founder and main visionary of the platform. Responsible for development strategy and building the community."
                        />
                        <Cards 
                            imageSrc="/src/assets/img/Kasia.jpg"
                            title="Kasia"
                            description="Technology and product development expert. Ensures the platform runs smoothly and efficiently."
                        />
                        <Cards 
                            imageSrc="/src/assets/img/Asia.jpg"
                            title="Asia"
                            description="Communication and marketing specialist. Creates bridges between the community and the platform."
                        />
                    </div>
                </div>
            </div>
            <Footer  />
        </div>
    )
}

export default AboutPage;