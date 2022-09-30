import React from "react";
import Carousel from "react-bootstrap/Carousel";
import efficiency from '../assets/images/efficiency.png'
import flexibility from '../assets/images/flexibility.png'
import power from '../assets/images/power.png'

const HomeCarousel = () => {
    return (
        <>
            <Carousel style={{ width: "100%", backgroundColor: "black", borderRadius: "10px" }}>
                <Carousel.Item >
                    <img
                        className="d-block w-100"
                        style={{ borderRadius: "10px", paddingBottom: "40px" }}
                        src={efficiency}
                        alt="Efficiency"
                    />
                    <Carousel.Caption>
                        <br /><br /><br />
                        <h5>Efficienza</h5>
                        <p>Tieni bassi i tuoi costi.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={flexibility}
                        style={{ borderRadius: "10px", paddingBottom: "40px" }}
                        alt="Flexibility"
                    />

                    <Carousel.Caption>
                        <br /><br /><br />
                        <h5>Flessibilità</h5>
                        <p>Accedi dovunque e con qualsiasi dispositivo.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={power}
                        style={{ borderRadius: "10px", paddingBottom: "40px" }}
                        alt="Power"
                    />

                    <Carousel.Caption style={{ paddingTop: "10%" }}>
                        <br /><br /><br />
                        <h5>Potenza</h5>
                        <p>Crea la macchina adatta alle tue esigenze al volo.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </>
    );
}

export default HomeCarousel;