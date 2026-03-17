// src/pages/AboutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AboutPage.css';

const AboutPage = () => {
  const team = [
    {
      name: 'Nguyễn Đức Phương',
      position: 'Founder & CEO',
      image: '👨‍💼'
    },
    {
      name: 'Trần Thị Lan',
      position: 'Creative Director',
      image: '👩‍🎨'
    },
    {
      name: 'Lê Văn Hải',
      position: 'Head of Production',
      image: '👨‍🔧'
    },
    {
      name: 'Nguyễn Văn Minh',
      position: 'Marketing Manager',
      image: '👩‍💼'
    }
  ];

  const timeline = [
    {
      year: '2020',
      title: 'Thành Lập YuuKi',
      description: 'Bắt đầu từ niềm đam mê thời trang nam, chúng tôi ra mắt bộ sưu tập đầu tiên tại Hải Phòng.'
    },
    {
      year: '2022',
      title: 'Mở Rộng Toàn Quốc',
      description: 'Ra mắt nền tảng trực tuyến, mang YuuKi đến gần hơn với khách hàng trên toàn Việt Nam.'
    },
    {
      year: '2024',
      title: 'Đột Phá Quốc Tế',
      description: 'Xuất khẩu sản phẩm đầu tiên và nhận giải thưởng "Thương Hiệu Thời Trang Nam Xuất Sắc".'
    },
    {
      year: '2025',
      title: 'Tương Lai Rực Rỡ',
      description: 'Tiếp tục đổi mới với công nghệ AI trong thiết kế, hướng tới mục tiêu trở thành biểu tượng thời trang Việt.'
    }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Chất Lượng Hàng Đầu',
      description: 'Mọi sản phẩm đều được chọn lọc kỹ lưỡng từ chất liệu cao cấp, đảm bảo sự thoải mái và bền bỉ theo thời gian.'
    },
    {
      icon: '💡',
      title: 'Sáng Tạo Không Giới Hạn',
      description: 'Chúng tôi luôn cập nhật xu hướng mới nhất, mang đến những thiết kế độc đáo, giúp bạn nổi bật mọi lúc mọi nơi.'
    },
    {
      icon: '🤝',
      title: 'Khách Hàng Là Trung Tâm',
      description: 'Phục vụ tận tâm, lắng nghe ý kiến và mang đến trải nghiệm mua sắm thân thiện, dễ dàng nhất cho bạn.'
    },
    {
      icon: '🌍',
      title: 'Bền Vững & Trách Nhiệm',
      description: 'Cam kết sản xuất thân thiện với môi trường, hỗ trợ cộng đồng địa phương và phát triển bền vững.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1>Chào Mừng Đến Với YuuKi</h1>
          <p>
            Thương hiệu thời trang nam Việt Nam, mang đến phong cách nam tính, 
            lịch lãm và trẻ trung cho mọi quý ông hiện đại.
          </p>
          <Link to="/products" className="cta-button">
            Khám Phá Sản Phẩm
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <h2>Về Chúng Tôi</h2>
          <p>
            YuuKi là hệ thống thời trang nam hàng đầu Việt Nam, được thành lập với sứ mệnh 
            mang đến những bộ sưu tập chất lượng cao, kết hợp giữa sự tinh tế truyền thống 
            và xu hướng hiện đại. Chúng tôi tin rằng, mỗi người đàn ông đều xứng đáng với 
            phong cách riêng, và YuuKi chính là người bạn đồng hành giúp bạn tỏa sáng.
          </p>
           {/* <img 
            src="https://scontent.fhph1-1.fna.fbcdn.net/v/t39.30808-6/481154058_1482568889815517_3319038012795028268_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEk2zs_UVxTjRR1aQVXbaPbMFi9-4sOW30wWL37iw5bfVkcC5XZnoIwvBD4w4vxXnbYFH6hl6K4_OkhZL-fdJ5-&_nc_ohc=g424czH2SEsQ7kNvwE9b6yV&_nc_oc=Admep-p2VHPC_Hv3juBzu5YpUX65JfRHJtuUIfDq4ztykWNclyCiAvQ2Tkmx872tCyO8Zi2hXTxIEApg7fKFFSjZ&_nc_zt=23&_nc_ht=scontent.fhph1-1.fna&_nc_gid=pYfBbbrzk_c6Ku8lgH6YNg&oh=00_AfnyV6nokDvH6TmDMSHtzQGmAuIvB1mo7WQLisd0UoLUyQ&oe=6938B3BB" 
            alt="Đội ngũ YuuKi" 
            className="about-image"
          />  */}
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Giá Trị Cốt Lõi</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <h2>Hành Trình Của Chúng Tôi</h2>
          <div className="timeline">
            {timeline.map((item, index) => (
              <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-content">
                  <div className="timeline-date">{item.year}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Đội Ngũ Của Chúng Tôi</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-member">
                <div className="team-image">{member.image}</div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p>{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;