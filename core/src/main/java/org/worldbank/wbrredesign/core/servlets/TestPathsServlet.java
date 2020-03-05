package org.worldbank.wbrredesign.core.servlets;

import java.io.IOException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonObject;

@SuppressWarnings("serial")
@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Test Paths Servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + "/bin/test" })
public class TestPathsServlet extends SlingAllMethodsServlet {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		logger.info("Test Paths Servlet");
		try {
			response.setCharacterEncoding("UTF-8");
			response.setContentType("application/json");

			JsonObject jsonObject = new JsonObject();
			jsonObject.addProperty("name", "rajendar");

			response.getWriter().write(jsonObject.toString());
		} catch (Exception e) {
			logger.info(e.getMessage());
		}
	}
}
