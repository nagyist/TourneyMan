'use strict';

class Table extends Model {

  init_data() {
    return {
      _id: -1,
      event_id: -1,
      round_id: -1,

      seat_ids: [],

      table_number: 0
    }
  }

  get_database() {
    return new PouchDB('tables');
  }

  get_relationships() {
    return {
      'has_a': {
        'event': Event,
        'round': Round
      },
      'has_many': {
        'seats': Seats
      },
      'as_referenced_by': {
        'table': Seats
      },
      'as_included_in': {
        'table_historys': Ranks,
        'tables': Rounds
      }
    }
  }

  record_scores(scores) {
    this.scores = scores;
  }

  get_player(position) {
    return this.players[position];
  }
}

class Tables extends Collection {

  get_database() {
    return new PouchDB("tables");
  }

  get_model_class() {
    return Table;
  }

}
