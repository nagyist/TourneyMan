'use strict';

class Seat extends Model {

  init_data() {
    return {
      _id: -1,
      table_id: -1,
      rank_id: -1,

      position: 0,
      score: 0,
      won: false
    }
  }

  get_database() {
    return new PouchDB('seats');
  }

  get_relationships() {
    return {
      'has_a': {
        'table': Table,
        'rank': Rank
      },
      'as_included_in': {
        'seat_historys': Ranks,
        'seats': Tables
      }
    }
  }

  is_occupied() {
    return this._data.rank_id != -1;
  }
}

class Seats extends Collection {

  get_database() {
    return new PouchDB("seats");
  }

  get_model_class() {
    return Seat;
  }

}

