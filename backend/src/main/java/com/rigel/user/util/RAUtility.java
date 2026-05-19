package com.rigel.user.util;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class RAUtility {

	public static long getCurrentDateTime() {
		ZoneId zoneId = ZoneId.of("Asia/Kolkata");
		ZonedDateTime zonedDateTime = ZonedDateTime.now(zoneId);

		// Epoch milliseconds
		long epochMilli = zonedDateTime.toInstant().toEpochMilli();

		return epochMilli;
	}
	
	 public static LocalDateTime epochToLocalDateTime(long epochMs) {
	        return Instant.ofEpochMilli(epochMs)
	                      .atZone(ZoneId.systemDefault())
	                      .toLocalDateTime();
	    }

}
