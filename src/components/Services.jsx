import React from 'react';

const ServiceItem = ({ icon, title, description, delay }) => (
  <div className={`col-md-6 col-lg-4 wow fadeInUp`} data-wow-delay={delay} id='service-section'>
    <div className="service-item p-4">
      <div className="service-icon mb-4">
        <i className={`fa ${icon} fa-2x`}></i>
      </div>
      <h5 className="mb-3">{title}</h5>
      <p className="mb-0">{description}</p>
    </div>
  </div>
);

const Services = () => {
  const serviceData = [
    {
      icon: "fa-phone-alt",
      title: "Phone Reservation",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit ipsam quasi quibusdam ipsa perferendis iusto?",
      delay: "0.1s",
    },
    {
      icon: "fa-money-bill-alt",
      title: "Special Rates",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit ipsam quasi quibusdam ipsa perferendis iusto?",
      delay: "0.3s",
    },
    {
      icon: "fa-road",
      title: "One Way Rental",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit ipsam quasi quibusdam ipsa perferendis iusto?",
      delay: "0.5s",
    },
    {
      icon: "fa-umbrella",
      title: "Life Insurance",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit ipsam quasi quibusdam ipsa perferendis iusto?",
      delay: "0.1s",
    },
    {
      icon: "fa-building",
      title: "City to City",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit ipsam quasi quibusdam ipsa perferendis iusto?",
      delay: "0.3s",
    },
    {
      icon: "fa-car-alt",
      title: "Free Rides",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit ipsam quasi quibusdam ipsa perferendis iusto?",
      delay: "0.5s",
    },
  ];

  return (
    <div className="container-fluid service py-5">
      <div className="container py-5">
        <div
          className="text-center mx-auto pb-5 wow fadeInUp"
          data-wow-delay="0.1s"
          style={{ maxWidth: "800px" }}
        >
          <h1 className="display-5 text-capitalize mb-3">
            Central <span className="text-primary">Services</span>
          </h1>
          <p className="mb-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut amet
            nemo expedita asperiores commodi accusantium at cum harum,
            excepturi, quia tempora cupiditate! Adipisci facilis modi quisquam
            quia distinctio.
          </p>
        </div>
        <div className="row g-4">
          {serviceData.map((service, index) => (
            <ServiceItem
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              delay={service.delay}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
