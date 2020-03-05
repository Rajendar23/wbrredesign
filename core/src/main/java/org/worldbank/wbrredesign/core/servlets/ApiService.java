package org.worldbank.wbrredesign.core.servlets;

import java.io.IOException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("serial")
@Component(immediate = true, service = Servlet.class, property = { "sling.servlet.methods=" + HttpConstants.METHOD_GET,
		"sling.servlet.paths=" + "/bin/testapi" })
@Designate(ocd = ApiService.Configuration.class)
public class ApiService extends SlingSafeMethodsServlet {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	private String domain;
	private String apiHeaderKey;
	private String apiHeaderValue;

	@Activate
	protected void Activate(Configuration config) {
		config.servlet_enabled();
		this.domain = config.api_domain();
		this.apiHeaderKey = config.api_header_key();
		this.apiHeaderValue = config.api_header_value();
	}

	@ObjectClassDefinition(name = "API Servlet")
	public @interface Configuration {
		@AttributeDefinition(name = "Enable the servlet", description = "Enable the servlet", type = AttributeType.BOOLEAN)
		boolean servlet_enabled() default true;

		@AttributeDefinition(name = "API Domain", description = "API Domain", type = AttributeType.STRING)
		String api_domain() default StringUtils.EMPTY;

		@AttributeDefinition(name = "API Header Key", type = AttributeType.STRING)
		String api_header_key() default StringUtils.EMPTY;

		@AttributeDefinition(name = "API Header Value", type = AttributeType.STRING)
		String api_header_value() default StringUtils.EMPTY;
	}

	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		try {
			logger.info("API Service");
			logger.info(domain);
			logger.info(apiHeaderKey);
			logger.info(apiHeaderValue);
			logger.info("API Service End");
		} catch (Exception e) {

		}

	}
}
