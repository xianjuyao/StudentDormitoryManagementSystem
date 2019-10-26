import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    AdminId: null,
    HouseMasterId: null,
    StudentId: null
  },
  mutations: {
    setHouseMasterId(state, HouseMasterId) {
      state.HouseMasterId = HouseMasterId;
    },
    setStudentId(state,StudentId){
      state.StudentId=StudentId;
    }
  },
  actions: {}
})
