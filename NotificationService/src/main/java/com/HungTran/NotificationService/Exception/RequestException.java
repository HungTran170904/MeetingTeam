package com.HungTran.NotificationService.Exception;

public class RequestException extends RuntimeException{
	public RequestException(String message) {
		super(message);
	}
	public RequestException(String message, Throwable cause) {
		super(message,cause);
	}
}
