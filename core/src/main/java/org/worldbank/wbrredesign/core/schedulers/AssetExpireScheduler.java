package org.worldbank.wbrredesign.core.schedulers;

import org.apache.sling.commons.scheduler.ScheduleOptions;
import org.apache.sling.commons.scheduler.Scheduler;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(immediate = true, service = AssetExpireScheduler.class)
@Designate(ocd = AssetExpireScheduler.Configuration.class)
public class AssetExpireScheduler implements Runnable {
	private final Logger logger = LoggerFactory.getLogger(getClass());
	private final static String JOB_NAME = "Asset Expire";

	@Reference
	private Scheduler scheduler;

	@Activate
	protected void activate(Configuration config) {
		logger.info("AssetExpireScheduler activate method");
	}

	@Modified
	protected void modified(Configuration config) {
		logger.info("AssetExpireScheduler modified method");

		if (config.enabled()) {
			removeScheduler();
			addScheduler(config);
		} else {
			removeScheduler();
		}
	}

	@Deactivate
	protected void deactivate(Configuration config) {
		logger.info("AssetExpireScheduler deactivate method");
		removeScheduler();
	}

	@ObjectClassDefinition(name = "Asset Expiration Scheduler")
	public static @interface Configuration {
		@AttributeDefinition(name = "Enable", description = "Enable the configuration", type = AttributeType.BOOLEAN)
		boolean enabled() default true;

		@AttributeDefinition(name = "Cron-job expression")
		String scheduler_expression() default "*/30 * * * * ?";

		@AttributeDefinition(name = "Concurrent task", description = "Whether or not to schedule this task concurrently")
		boolean scheduler_concurrent() default false;
	}

	private void addScheduler(Configuration config) {
		logger.debug("Add Scheduler Job '{}'");
		ScheduleOptions scheduleOptions = scheduler.EXPR(config.scheduler_expression());

		scheduleOptions.name(JOB_NAME);
		scheduleOptions.canRunConcurrently(false);
		scheduler.schedule(this, scheduleOptions);
	}

	private void removeScheduler() {
		logger.debug("Removing Scheduler Job '{}'");
		scheduler.unschedule(JOB_NAME);
	}

	@Override
	public void run() {
		logger.info("AssetExpireScheduler run method");
	}
}
