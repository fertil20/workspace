/*
package com.workspace.server.model;

import org.hibernate.annotations.NaturalId;

import javax.persistence.*;

    @Entity
    @Table(name = "working_days")
    public class WorkDay {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Enumerated(EnumType.STRING)
        @NaturalId
        @Column(length = 11)
        private WeekDay weekday;


        public WorkDay(WeekDay weekday) {
            this.weekday = weekday;
        }

        public WorkDay() {

        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public WeekDay getWeekday() {
            return weekday;
        }

        public void setWeekday(WeekDay weekday) {
            this.weekday = weekday;
        }
    }
*/
