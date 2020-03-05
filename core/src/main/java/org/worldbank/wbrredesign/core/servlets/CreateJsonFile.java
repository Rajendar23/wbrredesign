package org.worldbank.wbrredesign.core.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Map;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("serial")
@Component(service = Servlet.class, immediate = true, property = {
		Constants.SERVICE_DESCRIPTION + "=DynamicDropDown Servlet", "sling.servlet.paths=/bin/createjson",
		"sling.servlet.methods=" + HttpConstants.METHOD_POST })
public class CreateJsonFile extends SlingAllMethodsServlet {
	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		logger.info("Create Json");
		String exportPath = null;

		try {
			final boolean isMultipart = ServletFileUpload.isMultipartContent(request);

			if (isMultipart) {
				final Map<String, RequestParameter[]> params = request.getRequestParameterMap();
				logger.info("inside isMultipart");
				for (final Map.Entry<String, RequestParameter[]> pairs : params.entrySet()) {
					RequestParameter[] requestParameters = pairs.getValue();
					RequestParameter requestParameter = requestParameters[0];

					if (requestParameter.isFormField()) {
						exportPath = requestParameter.getString();
						logger.info(exportPath);
					} else {
						InputStream inputStream = requestParameter.getInputStream();
						BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));

						String line;
						while ((line = bufferedReader.readLine()) != null) {
							response.getWriter().write(line);
						}
					}
				}
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		response.getWriter().write(exportPath);
	}
}
