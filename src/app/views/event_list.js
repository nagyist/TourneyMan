'use strict';

import BaseView from '../framework/base_view';
import Global from '../framework/global';

import { Events } from '../models/event';

import EventTileComponentView from './components/event_tile_component';

export default class EventListView extends BaseView {

  constructor() {
    super();

    this.title = "TourneyMan";
    this.template = "event-list";

    this.model = {
      is_superuser: Global.instance().user.is_superuser()
    }

    this.event_set = null;

    this.events = {
      "click": {
        ".event_create": () => router.navigate("create_event"),
        ".on-close": () => router.navigate("back")
      }
    }
  }

  async pre_render() {
    router.menu_view.set_active_menu('events');

    this.event_set = new Events();

    const user = Global.instance().user;

    if(user.is_superuser()) {
      await this.event_set.all();
    }
    else {
      await this.event_set.fetch_where({
        $or: [
          { 'published': {$eq: true }},
          { 'organizer_id': {$eq: user.get_id()}}
        ]
      });
    }

    this.build_child_views();
    this.render_children();
  }

  build_child_views() {
    for(let e of this.event_set.models) {
      let event_tile_comp = new EventTileComponentView(e.get_id());

      this.add_child_view('.tiles', event_tile_comp);
    }
  }

}
