import  Menu  from '@/components/Menu'
import Cards from '@/components/Card';
import Footer from '@/components/Foooter';
import BasiaImg from '../assets/img/Basia.jpg';
import KasiaImg from '../assets/img/Kasia.jpg';
import AsiaImg from '../assets/img/Asia.jpg';

function HomePage() {
    return (
        <div className='w-full min-h-screen flex flex-col gap-4 p-4 bg-gray-50'> 
            <Menu />
            <div className="flex flex-col flex-1 items-center">
                <div className="w-full max-w-fit">
                    <p className='text-4xl font-bold'>Your Voice! Your Space!</p>
                    <p className='text-4xl font-bold mb-8'>Your Community!</p>
                    <p className="text-2xl font-semibold mb-4">Our Founders</p>
                    <div className="flex gap-6 flex-wrap">
                        <Cards 
                            imageSrc={BasiaImg}
                            title="Basia"
                            description="Co-founder and main visionary of the platform. Responsible for development strategy and building the community."
                        />
                        <Cards 
                            imageSrc={KasiaImg}
                            title="Kasia"
                            description="Technology and product development expert. Ensures the platform runs smoothly and efficiently."
                        />
                        <Cards 
                            imageSrc={AsiaImg}
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

export default HomePage;