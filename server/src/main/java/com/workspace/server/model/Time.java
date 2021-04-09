package com.workspace.server.model;


public enum Time{
    FIRST("06:00-14:00"), SECOND("07:00-15:00"), sdf("08:00-16:00"),
            sg("09:00-17:00"), gfd("10:00-18:00"), fd("11:00-19:00"),
    dfg("12:00-20:00"), gsf("13:00-21:00"), dsd("14:00-22:00");
    private String code;
    Time(String code){
        this.code = code;
    }
    public String getCode(){ return code;}
}
