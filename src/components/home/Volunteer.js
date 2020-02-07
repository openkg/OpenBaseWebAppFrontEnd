import React from 'react';
import Swiper from 'swiper/dist/js/swiper';
import 'swiper/dist/css/swiper.min.css';
import items from '../../config/volunteer';

class Volunteer extends React.PureComponent {
  componentDidMount() {
    this.mySwiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false, // 户操作swiper之后，是否禁止autoplay。默认为true：停止。
      },
      speed: 1000,
      autoplayDisableOnInteraction: false,
      autoHeight: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      loop: true,
    });
  }
  onMouseOver = () => {
    this.mySwiper.autoplay.stop();
  };
  onMouseOut = () => {
    this.mySwiper.autoplay.start();
  };
  renderSlideItem = (item, index) => {
    return (
      <li className="vol-item" key={index}>
        <img className="vol-pic" src={item.headpic} />
        <div className="vol-intro">
          <p>
            <span>{item.name}</span>
            <span title={item.role}>{item.role}</span>
          </p>
          <p>{item.organization}</p>
          <p>{item.position}</p>
        </div>
      </li>
    );
  };
  render() {
    const slides = [];
    let index = 0;
    let subItems = items.slice(0, 10);
    while (subItems.length > 0) {
      const elements = subItems.map((subitem, index) => {
        return this.renderSlideItem(subitem, index);
      });
      const slide = (
        <div className="swiper-slide" key={Math.random()} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
          <div className="slide-item">
            <ul>{elements}</ul>
          </div>
        </div>
      );
      slides.push(slide);

      index += 10;
      subItems = items.slice(index, index + 10);
    }
    return (
      <div className="content part-six">
        <div className="part-title">
          <img src="https://qiniu.ruyi.ai/volunteer.svg" width="36" height="36" alt="volunteer" />
          <span>OpenBase志愿者</span>
        </div>
        <div className="vol-list-wrapper">
          <div className="swiper-container">
            <div className="swiper-wrapper">{slides}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Volunteer;
