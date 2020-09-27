import Vue from "vue";
import AspectRatio from "components/AspectRatio";
import { Row, Col, CellGroup, Cell, List, Divider } from "vant";
[Row, Col, CellGroup, Cell, List, Divider].forEach((c) => Vue.use(c));

Vue.component(AspectRatio.name, AspectRatio);
