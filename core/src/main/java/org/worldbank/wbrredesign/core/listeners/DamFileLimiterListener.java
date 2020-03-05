package org.worldbank.wbrredesign.core.listeners;

import javax.jcr.observation.EventIterator;
import javax.jcr.observation.EventListener;

import org.osgi.service.component.ComponentContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(immediate = true, service = EventListener.class)
public class DamFileLimiterListener implements EventListener {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public void onEvent(EventIterator events) {
		logger.info("inside dam listener");
	}

	@Activate
	public void activate(ComponentContext context) {
		logger.info("inside dam listener active");
	}

	@Deactivate
	public void deactivate() {
		logger.info("inside dam listener de-active");
	}

}
