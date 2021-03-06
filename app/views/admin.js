'use strict';

class AdminView extends BaseView {

  constructor() {
    super();

    this.title = "Administration";
    this.template = "admin";

    this.user_set = null;
    this.event_set = null;
    this.event_template_set = null;
    this.round_set = null;
    this.rank_set = null;
    this.seat_set = null;
    this.table_set = null;

    this.model = {
      db_counts: [],
      node_version: process.versions.node,
      chrome_version: process.versions.chrome,
      electron_version: process.versions.electron
    }

    this.events = {
      "click": {
        ".event_list": () => router.navigate("event_list"),
        ".my_profile": () => this.onMyProfileClicked(),
        ".user_list": () => router.navigate("list_users"),
        ".logout": () => {
          window.user = null;
          router.navigate("login");
        },
        ".on-close": () => {
          router.navigate("back");
        },
        ".drop-db": (el) => this.onDropDatabaseClicked(el),
        ".clear_database": (el) => this.onClearDatabaseClicked(el),
        ".generate_data": (el) => this.onGenDataClicked(el),
      }
    }
  }

  pre_render() {
    this.user_set = new Users();
    this.event_set = new Events();
    this.event_template_set = new EventTemplates();
    this.round_set = new Rounds();
    this.rank_set = new Ranks();
    this.seat_set = new Seats();
    this.table_set = new Tables();

    this.user_set.all()
      .then( () => {
        return this.event_set.all();
      })
      .then( () => {
        return this.event_template_set.all();
      })
      .then( () => {
        return this.round_set.all();
      })
      .then( () => {
        return this.rank_set.all();
      })
      .then( () => {
        return this.seat_set.all();
      })
      .then( () => {
        return this.table_set.all();
      })
      .then( () => {
        this.update_model();
        this.rebind_events();
      })
  }

  update_model() {
    this.model.dbs = [
      {
        'name': 'Users',
        'set_name': 'user_set',
        'count': this.user_set.count()
      }, {
        'name': 'Events',
        'set_name': 'event_set',
        'count': this.event_set.count()
      }, {
        'name': 'EventTemplates',
        'set_name': 'event_template_set',
        'count': this.event_template_set.count()
      }, {
        'name': 'Rounds',
        'set_name': 'round_set',
        'count': this.round_set.count()
      }, {
        'name': 'Ranks',
        'set_name': 'rank_set',
        'count': this.rank_set.count()
      }, {
        'name': 'Seats',
        'set_name': 'seat_set',
        'count': this.seat_set.count()
      }, {
        'name': 'Tables',
        'set_name': 'table_set',
        'count': this.table_set.count()
      }
    ];
  }

  onDropDatabaseClicked(el) {
    let set_name = $(el.currentTarget).data('id');

    this[set_name].destroy().then( () => {
      this.update_model();
      this.rebind_events();
    });
  }

  onGenDataClicked(el) {
    console.log("Generating Users");
    for(let i=0; i < this.model.num_users; i++) {
      let new_user = new User();
      new_user.randomize(); //saves them by using register function.
    }

    console.log("Generating Events");
    for(let i=0; i < this.model.num_events; i++) {
      let new_event = new Event();
      new_event.randomize();
      new_event.save();
    }

    let events = new Events();
    let users = new Users();

    let p = events.all()
      .then( () => {
        return users.all();
      })

    console.log("Generating Players");
    for(let i=0; i < this.model.num_players; i++) {
      p = p.then(() => {
        return this.generate_player(users, events);
      });
    }

    p.then( () => {
      console.log("Finished Creating Players!");
    });
  }

  generate_player(users, events) {
    return new Promise( (resolve, reject) => {
      var user = chance.pickone(users.models);
      var event = chance.pickone(events.models);

      Promise.all([user, event])
        .then( values => {
          user = values[0];
          event = values[1];

          user.add_related_to_set('events', event);
          event.add_related_to_set('players', user);

          return user.save();
        })
        .then( () => {
          return event.save();
        })
        .then( () => {
          console.log("Created Player!");
          resolve();
        })
    });
  }
}
