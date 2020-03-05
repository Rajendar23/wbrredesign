package org.worldbank.wbrredesign.core.servlets;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.commons.collections4.iterators.TransformIterator;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceMetadata;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.commerce.common.ValueMapDecorator;
import com.adobe.granite.ui.components.ds.DataSource;
import com.adobe.granite.ui.components.ds.SimpleDataSource;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.day.cq.commons.jcr.JcrConstants;

@SuppressWarnings("serial")
@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Datasource Servlet",
		"sling.servlet.resourceTypes=" + "/apps/dropdown/datasource" })
public class Datasource extends SlingAllMethodsServlet {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		try {
			logger.info("inside datasource");
			ResourceResolver resourceResolver = request.getResourceResolver();
			final Map<String, String> countries = new LinkedHashMap();

			countries.put("in", "India");
			countries.put("us", "United States");
			countries.put("aus", "Australia");
			countries.put("pak", "Pakistan");
			countries.put("sri", "Srilanka");

			DataSource ds = new SimpleDataSource(new TransformIterator(countries.keySet().iterator(), country -> {
				ValueMap vm = new ValueMapDecorator(new HashMap<>());
				vm.put("value", country);
				vm.put("text", countries.get(country));
				return new ValueMapResource(resourceResolver, new ResourceMetadata(), JcrConstants.NT_UNSTRUCTURED, vm);
			}));
			request.setAttribute(DataSource.class.getName(), ds);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}

}
