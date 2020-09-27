import FloatBtn from "./index";
import SvgIcon from "components/SvgIcon";
import "./backtop.svg";
import TweenManager, { Tween } from "scripts/utils/tween-manager";

export async function backTop(duration = 300) {
  const doc = document.body.scrollTop
    ? document.body
    : document.documentElement;
  const start = doc.scrollTop;
  const manager = new TweenManager({
    duration,
    start,
    end: 0,
    easing: Tween.Linear,
  });
  while (manager.next()) {
    await TweenManager.frame();
    doc.scrollTop = manager.currentValue;
  }
}

async function fade(start, end, callback) {
  const manager = new TweenManager({
    duration: 150,
    start,
    end,
    easing: Tween.Quart.easeIn,
  });

  while (manager.next()) {
    await TweenManager.frame();
    callback(manager.currentValue);
  }
}

async function onLeave(el, done) {
  await fade(100, 0, (value) => {
    el.style.opacity = (value / 100).toFixed(2);
  });
  done();
}

async function onEnter(el, done) {
  await fade(0, 100, (value) => {
    el.style.opacity = (value / 100).toFixed(2);
  });
  done();
}

const BackTop = {
  name: "BackTop",
  functional: true,
  render(h, data) {
    return (
      <transition onEnter={onEnter} onLeave={onLeave}>
        <FloatBtn
          style="color: #333;font-size: 20px;"
          v-show={!data.props.hide}
          key="backTopBtn"
          {...data}
          onClick={() => backTop(300)}
        >
          {data.children || <SvgIcon name="backtop" />}
        </FloatBtn>
      </transition>
    );
  },
};

BackTop.backTop = backTop;

export default BackTop;
