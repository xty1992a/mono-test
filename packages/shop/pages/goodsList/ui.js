import Vue from "vue";
import AspectRatio from "components/AspectRatio";
import {
  Row,
  Col,
  CellGroup,
  Cell,
  List,
  Divider,
  Search,
  Swipe,
  SwipeItem,
  NoticeBar,
  Icon,
} from "vant";
[
  Row,
  Col,
  CellGroup,
  Cell,
  List,
  Divider,
  Search,
  Swipe,
  SwipeItem,
  NoticeBar,
  Icon,
].forEach((c) => Vue.use(c));

Vue.component(AspectRatio.name, AspectRatio);
