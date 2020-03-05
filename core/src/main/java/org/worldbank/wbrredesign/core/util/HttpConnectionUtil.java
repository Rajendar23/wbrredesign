package org.worldbank.wbrredesign.core.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.zip.GZIPInputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HttpConnectionUtil {
	private final Logger logger = LoggerFactory.getLogger(getClass());

	public StringBuilder getResponse(String api, String headerKey, String headerValue) {
		StringBuilder output = new StringBuilder();
		BufferedReader bufferedReader = null;

		try {
			URL url = new URL(api);
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setRequestMethod("GET");
			connection.setRequestProperty(headerKey, headerValue);

			if (connection.getResponseCode() == 200) {
				if (connection.getHeaderField("Content-Encoding") != null
						&& connection.getHeaderField("Content-Encoding").equals("gzip")) {
					bufferedReader = new BufferedReader(
							new InputStreamReader(new GZIPInputStream(connection.getInputStream())));
				} else {
					bufferedReader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
				}

				String inputLine = "";
				while ((inputLine = bufferedReader.readLine()) != null) {
					output.append(inputLine);
				}
			}

			connection.disconnect();
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return output;
	}
}